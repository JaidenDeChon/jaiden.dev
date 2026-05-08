<script setup lang="ts">
type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

interface ContactFormFields {
    name: string;
    email: string;
    subject: string;
    message: string;
    companyRole: string;
    _honeypot: string;
}

interface ContactResponse {
    success: boolean;
    message?: string;
}

const publicEmailAddress = 'hello@jaiden.dev';
const mailtoLink = `mailto:${publicEmailAddress}`;
const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';
const { isOpen, close } = useContactDialog();
const runtimeConfig = useRuntimeConfig();
const isTurnstileEnabled = runtimeConfig.public.isTurnstileEnabled;

const form = reactive<ContactFormFields>(createInitialForm());
const submissionState = ref<SubmissionState>('idle');
const errorMessage = ref('');
const turnstileToken = ref('');
const turnstile = ref<{ reset: () => void } | null>(null);
const copyTooltipLabel = ref('Copy email');
const copyTooltipOpen = ref(false);
const isCopyTooltipForcedOpen = ref(false);

let copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

const isSubmitting = computed(() => submissionState.value === 'loading');
const hasSucceeded = computed(() => submissionState.value === 'success');
const isCopyTooltipVisible = computed(() => isCopyTooltipForcedOpen.value || copyTooltipOpen.value);

watch(isOpen, async (open) => {
    if (open) {
        return;
    }

    resetDialogState();
    await nextTick();
    turnstile.value?.reset();
});

onBeforeUnmount(() => {
    clearCopyFeedbackTimeout();
});

function createInitialForm(): ContactFormFields {
    return {
        name: '',
        email: '',
        subject: '',
        message: '',
        companyRole: '',
        _honeypot: '',
    };
}

function clearCopyFeedbackTimeout() {
    if (!copyFeedbackTimeout) {
        return;
    }

    clearTimeout(copyFeedbackTimeout);
    copyFeedbackTimeout = null;
}

function resetDialogState() {
    Object.assign(form, createInitialForm());
    submissionState.value = 'idle';
    errorMessage.value = '';
    turnstileToken.value = '';
    clearCopyFeedbackTimeout();
    copyTooltipLabel.value = 'Copy email';
    copyTooltipOpen.value = false;
    isCopyTooltipForcedOpen.value = false;
}

function handleCopyTooltipOpenChange(open: boolean) {
    if (isCopyTooltipForcedOpen.value && !open) {
        return;
    }

    copyTooltipOpen.value = open;
}

async function copyEmailAddress() {
    try {
        await navigator.clipboard.writeText(publicEmailAddress);
        copyTooltipLabel.value = 'Copied';
        isCopyTooltipForcedOpen.value = true;
        copyTooltipOpen.value = true;
        clearCopyFeedbackTimeout();
        copyFeedbackTimeout = setTimeout(() => {
            copyTooltipLabel.value = 'Copy email';
            isCopyTooltipForcedOpen.value = false;
            copyTooltipOpen.value = false;
            copyFeedbackTimeout = null;
        }, 2000);
    }
    catch {
        copyTooltipLabel.value = 'Copy failed';
        isCopyTooltipForcedOpen.value = true;
        copyTooltipOpen.value = true;
        clearCopyFeedbackTimeout();
        copyFeedbackTimeout = setTimeout(() => {
            copyTooltipLabel.value = 'Copy email';
            isCopyTooltipForcedOpen.value = false;
            copyTooltipOpen.value = false;
            copyFeedbackTimeout = null;
        }, 2000);
    }
}

function getRequestErrorMessage(error: unknown) {
    if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (error as { data?: { message?: string } }).data;

        if (typeof data?.message === 'string' && data.message.length > 0) {
            return data.message;
        }
    }

    if (error instanceof Error && error.message.length > 0) {
        return error.message;
    }

    return 'Your message could not be sent right now. Please try again.';
}

async function resetTurnstileWidget() {
    turnstileToken.value = '';
    await nextTick();
    turnstile.value?.reset();
}

async function submitForm() {
    if (isSubmitting.value) {
        return;
    }

    errorMessage.value = '';

    const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        companyRole: form.companyRole.trim(),
        _honeypot: form._honeypot,
        token: turnstileToken.value,
    };

    if (isTurnstileEnabled && !payload.token) {
        submissionState.value = 'error';
        errorMessage.value = 'Please complete the verification before sending your message.';
        return;
    }

    submissionState.value = 'loading';

    try {
        const response = await $fetch<ContactResponse>('/api/contact', {
            method: 'POST',
            body: payload,
        });

        if (!response.success) {
            throw new Error(response.message || 'Your message could not be sent right now.');
        }

        submissionState.value = 'success';
    }
    catch (error) {
        submissionState.value = 'error';
        errorMessage.value = getRequestErrorMessage(error);
        await resetTurnstileWidget();
    }
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogContent class="h-[min(42rem,calc(100vh-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto afacad sm:p-8">
            <div class="flex items-start justify-between gap-4">
                <DialogHeader>
                    <DialogTitle>Get In Touch</DialogTitle>
                </DialogHeader>

                <DialogClose as-child>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        aria-label="Close dialog"
                    >
                        <Icon
                            name="mdi:close"
                            class="h-[1.2rem] w-[1.2rem]"
                        />
                    </Button>
                </DialogClose>
            </div>

            <section class="flex flex-col gap-4">
                <div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:items-center">
                    <a
                        :href="mailtoLink"
                        class="min-w-0 break-words text-xl text-foreground fancy-text-decoration"
                    >
                        {{ publicEmailAddress }}
                    </a>

                    <div class="flex shrink-0 items-center gap-3">
                        <tooltip-provider :delay-duration="150">
                            <tooltip>
                                <tooltip-trigger as-child>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        as-child
                                    >
                                        <a :href="mailtoLink">
                                            <Icon
                                                name="gravity-ui:envelope"
                                                class="h-[1.2rem] w-[1.2rem]"
                                            />
                                        </a>
                                    </Button>
                                </tooltip-trigger>
                                <tooltip-content>
                                    <p>Email me</p>
                                </tooltip-content>
                            </tooltip>
                        </tooltip-provider>

                        <tooltip-provider :delay-duration="150">
                            <tooltip
                                :open="isCopyTooltipVisible"
                                @update:open="handleCopyTooltipOpenChange"
                            >
                                <tooltip-trigger as-child>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        @click="copyEmailAddress"
                                    >
                                        <Icon
                                            name="mdi:content-copy"
                                            class="h-[1.2rem] w-[1.2rem]"
                                        />
                                    </Button>
                                </tooltip-trigger>
                                <tooltip-content>
                                    <p>{{ copyTooltipLabel }}</p>
                                </tooltip-content>
                            </tooltip>
                        </tooltip-provider>
                    </div>
                </div>
            </section>

            <Separator />

            <section class="flex flex-col gap-5">
                <div class="space-y-1">
                    <h3 class="text-lg font-semibold">
                        Send a message
                    </h3>
                </div>

                <div
                    v-if="hasSucceeded"
                    class="rounded-lg border border-border bg-secondary/60 p-5"
                >
                    <h4 class="text-lg font-semibold">
                        Message sent
                    </h4>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Thanks for reaching out. I have your message and will reply as soon as I can.
                    </p>
                    <DialogFooter class="mt-4">
                        <Button
                            type="button"
                            @click="close"
                        >
                            Close dialog
                        </Button>
                    </DialogFooter>
                </div>

                <form
                    v-else
                    class="flex flex-col gap-4"
                    @submit.prevent="submitForm"
                >
                    <div class="grid gap-4 sm:grid-cols-2">
                        <label class="flex flex-col gap-2 text-sm font-medium text-foreground">
                            Name *
                            <input
                                v-model="form.name"
                                :class="inputClass"
                                autocomplete="name"
                                :disabled="isSubmitting"
                                maxlength="120"
                                name="name"
                                required
                                type="text"
                            >
                        </label>

                        <label class="flex flex-col gap-2 text-sm font-medium text-foreground">
                            Email *
                            <input
                                v-model="form.email"
                                :class="inputClass"
                                autocomplete="email"
                                :disabled="isSubmitting"
                                maxlength="160"
                                name="email"
                                required
                                type="email"
                            >
                        </label>
                    </div>

                    <label class="flex flex-col gap-2 text-sm font-medium text-foreground">
                        Subject *
                        <input
                            v-model="form.subject"
                            :class="inputClass"
                            :disabled="isSubmitting"
                            maxlength="160"
                            name="subject"
                            required
                            type="text"
                        >
                    </label>

                    <label class="flex flex-col gap-2 text-sm font-medium text-foreground">
                        Company / Role
                        <input
                            v-model="form.companyRole"
                            :class="inputClass"
                            autocomplete="organization-title"
                            :disabled="isSubmitting"
                            maxlength="160"
                            name="companyRole"
                            type="text"
                        >
                    </label>

                    <label class="flex flex-col gap-2 text-sm font-medium text-foreground">
                        Message *
                        <textarea
                            v-model="form.message"
                            :class="`${inputClass} min-h-36 resize-y`"
                            :disabled="isSubmitting"
                            maxlength="4000"
                            name="message"
                            required
                        />
                    </label>

                    <label
                        class="contact-dialog__honeypot"
                        aria-hidden="true"
                    >
                        Company
                        <input
                            v-model="form._honeypot"
                            autocomplete="off"
                            name="company"
                            tabindex="-1"
                            type="text"
                        >
                    </label>

                    <NuxtTurnstile
                        v-if="isTurnstileEnabled"
                        ref="turnstile"
                        v-model="turnstileToken"
                    />

                    <p
                        v-else
                        class="text-sm text-muted-foreground"
                    >
                        Verification is disabled in local development.
                    </p>

                    <div
                        v-if="submissionState === 'error' && errorMessage"
                        class="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        role="alert"
                    >
                        {{ errorMessage }}
                    </div>

                    <DialogFooter>
                        <Button
                            class="min-w-40"
                            :disabled="isSubmitting"
                            type="submit"
                        >
                            <span
                                v-if="isSubmitting"
                                class="mr-2 inline-block size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                            />
                            {{ isSubmitting ? 'Sending...' : 'Send message' }}
                        </Button>
                    </DialogFooter>
                </form>
            </section>
        </DialogContent>
    </Dialog>
</template>

<style scoped>
.contact-dialog__honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
</style>
