// TODO: Replace [PHONE] with the actual phone number before publishing
export const PHONE = '602-884-6936';

export const ANNUAL_MULTIPLIER = 10;
export const BUYOUT_MULTIPLIER = 6;

export interface PlanFeature {
    text: string;
    isHeader?: boolean;
}

export interface Plan {
    id: string;
    name: string;
    monthlyPrice: number;
    fromPrice: boolean;
    recommended: boolean;
    tagline: string;
    features: PlanFeature[];
    annualPrice: number;
    buyoutPrice: number;
}

const planData = [
    {
        id: 'starter',
        name: 'Starter',
        monthlyPrice: 59,
        fromPrice: false,
        recommended: false,
        tagline: 'For the business that needs to be findable and credible.',
        features: [
            { text: 'Up to 3 pages (or one long-scroll page), custom-designed, mobile-first' },
            { text: 'Hosting, SSL, daily backups, security updates' },
            { text: 'Domain registered in your name (renewal billed at registrar cost, roughly $15–20/year)' },
            { text: 'Click-to-call, contact form, map embed' },
            { text: 'Google Business Profile setup and link' },
            { text: 'Basic on-page SEO' },
            { text: '2 content edits per month' },
            { text: 'Email support, response within 2 business days' },
        ],
    },
    {
        id: 'business',
        name: 'Business',
        monthlyPrice: 149,
        fromPrice: false,
        recommended: true,
        tagline: 'For the business that\'s actively growing.',
        features: [
            { text: 'Everything in Starter, plus:', isHeader: true },
            { text: 'Up to 8 pages' },
            { text: 'Photo galleries, testimonials/reviews section' },
            { text: 'Blog or news section' },
            { text: 'Booking/scheduling embed (your account)' },
            { text: 'Expanded local SEO and Google Business Profile optimization' },
            { text: '3 content edits per month' },
            { text: 'Monthly traffic snapshot' },
            { text: 'Email + text support, response next business day' },
        ],
    },
    {
        id: 'commerce',
        name: 'Commerce',
        monthlyPrice: 299,
        fromPrice: true,
        recommended: false,
        tagline: 'For the business that sells or takes orders online.',
        features: [
            { text: 'Everything in Business, plus:', isHeader: true },
            { text: 'Online ordering / e-commerce integration (Shopify, Square, Toast, etc. — in your account; platform fees paid by you directly, never marked up by me)' },
            { text: 'Up to 50 products/menu items loaded at launch (larger catalogs quoted upfront)' },
            { text: 'Ongoing integration monitoring and upkeep' },
            { text: '5 edits per month (product, price, and menu changes count as edits)' },
            { text: 'Priority support, same or next business day' },
            { text: 'Complex or multi-system integrations quoted individually, in writing, before any commitment' },
        ],
    },
];

export const PLANS: Plan[] = planData.map(p => ({
    ...p,
    features: [...p.features],
    annualPrice: p.monthlyPrice * ANNUAL_MULTIPLIER,
    buyoutPrice: p.monthlyPrice * BUYOUT_MULTIPLIER,
}));

export interface AlacarteItem {
    item: string;
    price: string;
    notes: string;
    buyoutDerived?: boolean;
}

export const ALACARTE_ITEMS: AlacarteItem[] = [
    { item: 'Extra edit', price: '$35', notes: 'Additional modifications beyond your plan\'s monthly allotment' },
    { item: 'Larger work (hourly)', price: '$85/hr', notes: 'Always quoted in writing before work begins' },
    { item: 'New page', price: '$75', notes: 'If you need 2+ pages, upgrading tiers is usually cheaper — I\'ll tell you when it is' },
    { item: 'Copywriting from scratch', price: '$75/page', notes: 'Polishing the text you provide is always included' },
    { item: 'Professional email setup', price: '$50 one-time', notes: 'Google Workspace / Microsoft 365 — subscription paid by you directly' },
    { item: 'Rush turnaround (same/next day)', price: '+$25 per edit', notes: '' },
    { item: 'Additional integration (Commerce)', price: 'from $200 setup', notes: 'Quoted first' },
    { item: 'Premium stock photos / paid plugins', price: 'At cost', notes: 'Free libraries used by default; receipts provided' },
    { item: 'Hosting-only plan', price: '$25/mo', notes: 'Site stays live, secure, backed up — no edits (after initial term)' },
    {
        item: 'Site buyout',
        price: `Monthly cost x${BUYOUT_MULTIPLIER}`,
        notes: 'Flat price: 6x your current monthly rate ($354 / $894 / $1,794), available anytime after the first 30 days. Buying out your site ends your agreement immediately; nothing else will be owed. From there, your site can be taken to any host or you can stay on the $25/mo hosting-only plan.',
        buyoutDerived: true,
    },
];

export const TRUST_PILLARS = [
    '$0 down',
    'Your price, locked in forever',
    'You own your domain',
    'Talk to the same human, every time',
    'Free updates with every plan',
    'Transparent business practices',
    'Subscribers\' broken sites are prioritized and fixed free of charge',
] as const;

export const UNIVERSAL_TERMS = [
    '12-month initial term',
    'month-to-month after that',
    'cancel within the first 30 days and owe nothing',
] as const;

export interface FaqItem {
    question: string;
    answer: string;
}

export const HOSTING_ONLY_PRICE = 25;
export const HOURLY_RATE = 85;

const fmtUSD = (n: number) => `$${n.toLocaleString('en-US')}`;

const buyoutFor = (id: string) =>
    fmtUSD(PLANS.find(p => p.id === id)!.buyoutPrice);

const starterBuyout = buyoutFor('starter'); // "$354"
const businessBuyout = buyoutFor('business'); // "$894"
const commerceBuyout = buyoutFor('commerce'); // "$1,794"

const hostingOnlyPrice = fmtUSD(HOSTING_ONLY_PRICE); // → "$25/mo" in copy
const hourlyRate = fmtUSD(HOURLY_RATE); // → "$85/hr" in copy

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'What the heck is this?',
        answer: 'I\'m a web developer. I create and sell websites at a low cost. Since it\'s just me, I can charge much lower rates than larger businesses. The experience you have is also more personal and human because we -- as in you and I -- talk when something is needed. I would love to be your website guy. ',
    },
    {
        question: 'What counts as a content edit?',
        answer: 'One request that takes up to about 30 minutes — text changes, photo swaps, updating hours, menu prices, a new testimonial. Unused edits roll over one month (max bank: 2x your monthly allowance).',
    },
    {
        question: 'What\'s always free, no matter what?',
        answer: 'Bug fixes, security patches, downtime, and anything that stops working never count as edits and never bill hourly. If something breaks, I fix it. You don\'t pay me to fix my own work.',
    },
    {
        question: 'What do I actually own?',
        answer: 'Your domain is registered in your name from day one — it\'s yours regardless of what happens. Your content, your photos, and every third-party account (Google Business, booking tools, etc.) are yours. I own the site build itself until buyout.',
    },
    {
        question: 'What if I want to leave?',
        answer: 'Within the first 30 days: cancel and owe nothing. After that, during the initial 12-month term: pay out the remaining months and end service, or buy the site at 6x your monthly rate and own it outright. After month 12: just 30 days\' notice to cancel, or the buyout to own.',
    },
    {
        question: 'What does "no markups" actually mean?',
        answer: 'Third-party costs — domain renewals, platform subscriptions, stock photos — are either paid by you directly or passed through at cost with receipts. I don\'t add a percentage on top of anything someone else made.',
    },
    {
        question: 'What is the Forever Rate?',
        answer: 'The price you sign up at is your price for life, as long as you stay continuously subscribed. It never increases. The lock covers your plan as defined at signup — if you change tiers or cancel and return, you join at the current rate card.',
    },
    {
        question: 'What happens if my site goes down?',
        answer: 'Site-down emergencies are treated as urgent at every tier, including Starter. I\'m on it as soon as I see it.',
    },
    {
        question: 'How does site buyout work?',
        answer: '',
    },
];
