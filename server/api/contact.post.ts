import { Resend } from 'resend';

interface ContactRequestBody {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    companyRole?: string;
    token?: string;
    _honeypot?: string;
}

function fail(event: H3Event, statusCode: number, message: string, details?: string[]) {
    setResponseStatus(event, statusCode);

    return {
        success: false,
        message,
        ...(details && details.length > 0 ? { details } : {}),
    };
}

function sanitizeText(value: string | undefined) {
    return value?.trim() || '';
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&#39;');
}

function formatMultilineText(value: string) {
    return escapeHtml(value).replaceAll('\n', '<br />');
}

function renderRow(label: string, value: string) {
    return `
        <tr>
            <td style="padding: 10px 0; font-weight: 600; vertical-align: top; width: 140px; color: #0f172a;">${escapeHtml(label)}</td>
            <td style="padding: 10px 0; color: #334155;">${value}</td>
        </tr>
    `;
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default defineEventHandler(async (event) => {
    const body = await readBody<ContactRequestBody>(event);
    const config = useRuntimeConfig(event);
    const isTurnstileEnabled = config.public.isTurnstileEnabled;

    if (sanitizeText(body?._honeypot).length > 0) {
        return fail(event, 400, 'Spam submission rejected.');
    }

    const token = sanitizeText(body?.token);

    if (isTurnstileEnabled) {
        if (!token) {
            return fail(event, 400, 'Verification token is missing.');
        }

        const turnstileResult = await verifyTurnstileToken(token, event);

        if (!turnstileResult.success) {
            return fail(
                event,
                400,
                'Turnstile verification failed. Please try again.',
                Array.isArray(turnstileResult['error-codes']) ? turnstileResult['error-codes'] : undefined,
            );
        }
    }

    const payload = {
        name: sanitizeText(body?.name),
        email: sanitizeText(body?.email),
        subject: sanitizeText(body?.subject),
        message: sanitizeText(body?.message),
        companyRole: sanitizeText(body?.companyRole),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
        return fail(event, 400, 'Name, email, subject, and message are required.');
    }

    if (!isValidEmail(payload.email)) {
        return fail(event, 400, 'Please provide a valid email address.');
    }

    const resendApiKey = sanitizeText(config.resendApiKey);
    const contactEmail = sanitizeText(config.contactEmail);
    const contactFromEmail = sanitizeText(config.contactFromEmail);

    if (!resendApiKey || !contactEmail) {
        return fail(event, 500, 'Contact form configuration is incomplete on the server.');
    }

    const resend = new Resend(resendApiKey);
    const html = `
        <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
            <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
                <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #64748b;">jaiden.dev</p>
                <h1 style="margin: 0 0 12px; font-size: 24px; line-height: 1.2;">New contact form submission</h1>
                <p style="margin: 0 0 28px; color: #475569;">Someone sent a message through the contact dialog on your portfolio site.</p>

                <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    ${renderRow('Name', escapeHtml(payload.name))}
                    ${renderRow('Email', `<a href="mailto:${escapeHtml(payload.email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(payload.email)}</a>`)}
                    ${renderRow('Subject', escapeHtml(payload.subject))}
                    ${renderRow('Company / Role', escapeHtml(payload.companyRole || 'Not provided'))}
                </table>

                <div style="margin-top: 28px;">
                    <h2 style="margin: 0 0 12px; font-size: 16px;">Message</h2>
                    <div style="padding: 16px; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; line-height: 1.7;">
                        ${formatMultilineText(payload.message)}
                    </div>
                </div>
            </div>
        </div>
    `;

    const { error } = await resend.emails.send({
        to: contactEmail,
        from: contactFromEmail,
        replyTo: payload.email,
        subject: payload.subject,
        html,
    });

    if (error) {
        return fail(event, 502, error.message || 'Unable to send your message right now.');
    }

    return { success: true };
});
