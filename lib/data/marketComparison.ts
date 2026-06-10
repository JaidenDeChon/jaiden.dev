import { PLANS } from './pricing';

export const HORIZON_MONTHS = 36;

const starter = PLANS.find(p => p.id === 'starter')!;
const business = PLANS.find(p => p.id === 'business')!;
const commerce = PLANS.find(p => p.id === 'commerce')!;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CostRow {
    label: string;
    type: 'mine' | 'market';
    /** For mine rows: exact monthly price. For market rows: low end of range. */
    low: number;
    /** For mine rows: same as low. For market rows: high end of range. */
    high: number;
    /** Full tooltip explaining the math. */
    tooltip: string;
    diyTag?: boolean;
    planId?: string;
}

export interface CumulativeSeries {
    key: string;
    label: string;
    /** Appended to label in legend and tooltips, e.g. "(typical)". */
    labelSuffix?: string;
    type: 'mine' | 'market';
    upfront: number;
    monthly: number;
}

export interface Source {
    claim: string;
    url: string;
    retrieved: string;
}

// ─── Chart 1: horizontal cost bar ────────────────────────────────────────────

/** Scale maximum in $/mo (agency high end). Every bar is drawn relative to this. */
export const BAR_SCALE_MAX = 833;

export const COST_ROWS: CostRow[] = [
    {
        label: 'DIY builder (Wix, Squarespace)',
        type: 'market',
        low: 23,
        high: 39,
        tooltip: 'Squarespace Basic ~$23/mo or Wix Core $29/mo on annual billing — the minimum plans that support a real business presence. Does not include your own hours spent building and editing.',
        diyTag: true,
    },
    {
        label: 'jaiden.dev Starter',
        type: 'mine',
        low: starter.monthlyPrice,
        high: starter.monthlyPrice,
        tooltip: `$${starter.monthlyPrice}/mo · $0 down · Forever Rate · 2 edits/mo included · hosting, SSL, backups, domain in your name`,
        planId: 'starter',
    },
    {
        label: 'Other subscription shops (comparable, averaged)',
        type: 'market',
        low: 99,
        high: 175,
        tooltip: 'Comparable subscription web design services range $99–$149/mo for entry tiers (2–10 updates/mo). Some require 12-month minimums and keep the site on their platform if you cancel.',
    },
    {
        label: 'jaiden.dev Business',
        type: 'mine',
        low: business.monthlyPrice,
        high: business.monthlyPrice,
        tooltip: `$${business.monthlyPrice}/mo · $0 down · Forever Rate · 3 edits/mo included · blog, gallery, scheduling embed`,
        planId: 'business',
    },
    {
        label: 'Freelance designer',
        type: 'market',
        low: 92,
        high: 261,
        tooltip: 'Typical build: $1,500–$4,000 spread over 36 months ($42–$111/mo) plus $50–$150/mo upkeep = $92–$261/mo equivalent. Does not include your time coordinating revisions.',
    },
    {
        label: 'jaiden.dev Commerce',
        type: 'mine',
        low: commerce.monthlyPrice,
        high: commerce.monthlyPrice,
        tooltip: `From $${commerce.monthlyPrice}/mo · $0 down · Forever Rate · 5 edits/mo · e-commerce integration (Shopify, Square, Toast, etc.)`,
        planId: 'commerce',
    },
    {
        label: 'Web agency',
        type: 'market',
        low: 367,
        high: 833,
        tooltip: 'Typical small-business agency build: $6,000–$12,000 spread over 36 months ($167–$333/mo) plus $200–$500/mo maintenance retainer = $367–$833/mo equivalent.',
    },
];

// ─── Chart 2: cumulative cost series ─────────────────────────────────────────

export const CUMULATIVE_SERIES: CumulativeSeries[] = [
    {
        key: 'diy',
        label: 'DIY builder',
        labelSuffix: '(typical)',
        type: 'market',
        upfront: 0,
        monthly: 31, // midpoint of $23–$39
    },
    {
        key: 'starter',
        label: 'jaiden.dev Starter',
        type: 'mine',
        upfront: 0,
        monthly: starter.monthlyPrice,
    },
    {
        key: 'business',
        label: 'jaiden.dev Business',
        type: 'mine',
        upfront: 0,
        monthly: business.monthlyPrice,
    },
    {
        key: 'freelancer',
        label: 'Freelancer',
        labelSuffix: '(typical)',
        type: 'market',
        upfront: 2750, // midpoint of $1,500–$4,000 build
        monthly: 100, // midpoint of $50–$150 upkeep
    },
    {
        key: 'agency',
        label: 'Agency',
        labelSuffix: '(typical)',
        type: 'market',
        upfront: 9000, // midpoint of $6,000–$12,000 build
        monthly: 350, // midpoint of $200–$500 maintenance
    },
];

export type CumulativeKey = 'diy' | 'starter' | 'business' | 'freelancer' | 'agency' | 'month';
export type CumulativePoint = Record<CumulativeKey, number>;

/** Generates month-by-month cumulative totals for all series. */
export function generateCumulativeData(months = HORIZON_MONTHS): CumulativePoint[] {
    return Array.from({ length: months + 1 }, (_, m) => {
        const point = { month: m } as CumulativePoint;
        for (const s of CUMULATIVE_SERIES) {
            point[s.key as CumulativeKey] = s.upfront + s.monthly * m;
        }
        return point;
    });
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export const SOURCES: Source[] = [
    {
        claim: 'Wix plans $17–$159/mo; Core ($29/mo) is the minimum plan to sell online',
        url: 'https://craftybase.com/blog/wix-pricing-how-much-does-wix-cost',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Squarespace plans roughly $16–$65/mo across tiers',
        url: 'https://www.nerdwallet.com/business/software/learn/squarespace-plans',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Squarespace four-tier pricing; annual billing saves ~25–40%',
        url: 'https://www.techradar.com/pro/website-building/squarespace-pricing',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Freelance build $1,500–$4,000 at $50–$100/hr; boutique agency build $6,000–$12,000; post-launch hourly $75–$150',
        url: 'https://gruffygoat.com/blog/small-business-website-cost',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Most professional small-business builds $3,000–$15,000; freelance custom up to $8,000',
        url: 'https://www.jim.com/blog/small-business-website-cost',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Small-business professional builds average $2,000–$8,000; advanced $15,000+',
        url: 'https://www.levitate.ai/blog-posts/average-website-design-cost-for-small-businesses-in-2026',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Basic website maintenance $50–$150/mo; comprehensive packages $150–$500/mo',
        url: 'https://elementor.com/blog/website-maintenance-cost/',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Small-business site maintenance typically $35–$500/mo',
        url: 'https://www.networksolutions.com/blog/website-maintenance-cost/',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Agency maintenance packages $200–$2,500/mo (small-business slice: $200–$500/mo)',
        url: 'https://websitesetup.org/website-maintenance-costs/',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Subscription shop comp: $150/mo, $0 down, 12-month minimum, up to 5 pages — site stays on their platform if you cancel',
        url: 'https://www.itspaul.ca/services/subscription-based-website-design-for-small-businesses/',
        retrieved: '2026-06-09',
    },
    {
        claim: 'Subscription shop comp: $99–$149/mo tiers with 2–10 content updates/mo',
        url: 'https://kosmorph.gumroad.com/l/website-setup',
        retrieved: '2026-06-09',
    },
];
