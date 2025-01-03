const animate = require('tailwindcss-animate');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    safelist: ['dark'],
    prefix: '',
    plugins: [animate, typography],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                'border': 'hsl(var(--border))',
                'input': 'hsl(var(--input))',
                'ring': 'hsl(var(--ring))',
                'background': 'hsl(var(--background))',
                'foreground': 'hsl(var(--foreground))',
                'primary': {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                'secondary': {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                'destructive': {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                'muted': {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                'accent': {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                'popover': {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                'card': {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                'brand-blue': {
                    DEFAULT: 'hsl(var(--brand-blue))',
                    foreground: 'hsl(var(--brand-blue-foreground))',
                },
                'brand-blue-darker': {
                    DEFAULT: 'hsl(var(--brand-blue-darker))',
                    foreground: 'hsl(var(--brand-blue-foreground))',
                },
                'brand-yellow': {
                    DEFAULT: 'hsl(var(--brand-yellow))',
                    foreground: 'hsl(var(--brand-yellow-foreground))',
                },
                'brand-yellow-darker': {
                    DEFAULT: 'hsl(var(--brand-yellow-darker))',
                    foreground: 'hsl(var(--brand-yellow-foreground))',
                },
            },
            borderRadius: {
                xl: 'calc(var(--radius) + 4px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                'collapsible-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-collapsible-content-height)' },
                },
                'collapsible-up': {
                    from: { height: 'var(--radix-collapsible-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'collapsible-down': 'collapsible-down 0.2s ease-in-out',
                'collapsible-up': 'collapsible-up 0.2s ease-in-out',
            },
            screens: {
                // Extending Tailwind's default breakpoints
                '3xl': '1792px',
                '4xl': '2048px',
                '5xl': '2560px',
                '6xl': '3072px',
                '7xl': '3840px',
            },
        },
        transitionDuration: {
            DEFAULT: '420ms',
            75: '75ms',
            100: '100ms',
            150: '150ms',
            200: '200ms',
            300: '300ms',
            500: '500ms',
            700: '700ms',
            1000: '1000ms',
        },
    },
};
