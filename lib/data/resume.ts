/**
 * Single source of truth for the resume at /resume and for the exported PDF at
 * public/jaiden_dechon_resume.pdf. Editing the resume should mean editing this
 * file and nothing else — the components in components/resume are purely
 * presentational.
 *
 * Ordering is deliberate throughout (skills especially). Do not sort.
 */

/** A run of text with optional emphasis, so copy can carry inline bold/italic. */
export interface ResumeTextRun {
    text: string;
    bold?: boolean;
    italic?: boolean;
}

/** A bulleted achievement: an optional bold lead-in label, then body copy. */
export interface ResumeBullet {
    label?: string;
    text: string;
}

export interface ResumeContactRow {
    text: string;
    href?: string;
    bold?: boolean;
}

export interface ResumeJob {
    dateRange: string;
    title: string;
    company: string;
    location: string;
    bullets: ResumeBullet[];
}

export interface ResumeProject {
    name: string;
    url: string;
    href: string;
    /** Screenshot from public/img, rendered as a thumbnail beside the copy. */
    image: string;
    description: ResumeTextRun[];
}

export interface ResumeReference {
    name: string;
    role?: string;
}

export interface ResumeLink {
    /** Not rendered — the icon stands in for it. Kept as the accessible name. */
    label: string;
    /** Iconify name from a collection installed in this project. */
    icon: string;
    url: string;
    href: string;
}

export interface ResumeCourse {
    date: string;
    title: string;
    provider: string;
}

export interface ResumeCertification {
    title: string;
    provider: string;
    href: string;
    description: string;
    certificateNumber: string;
    completionDate: string;
}

export const RESUME_NAME_LINES = ['Jaiden', 'DeChon'] as const;

export const RESUME_TAGLINE = 'Software Engineer & Web Developer';

export const RESUME_CONTACT_ROWS: ResumeContactRow[] = [
    { text: 'jaiden.dev', href: 'https://jaiden.dev', bold: true },
    { text: 'Buckeye, AZ' },
    { text: 'hello@jaiden.dev', href: 'mailto:hello@jaiden.dev' },
    { text: 'linkedin.com/in/jaiden-dechon', href: 'https://www.linkedin.com/in/jaiden-dechon/' },
    { text: '602-884-6936', href: 'tel:+16028846936' },
];

/**
 * TODO: confirm the intended bold spans. The brief called for exactly three
 * bold spans in the summary but the emphasis markers did not survive into the
 * copy that was handed over, so these three are a best guess at the intent.
 * Adjust the `bold` flags below if different phrases were meant.
 */
export const RESUME_SUMMARY: ResumeTextRun[][] = [
    [
        { text: 'Full-Stack Software Engineer with 11 years of experience', bold: true },
        { text: '; 6 of which in a professional engineering role focused on web application development. Specializes in ' },
        { text: 'TypeScript and the Vue/Nuxt ecosystem', bold: true },
        { text: '. Experienced in leading development teams, including one that ' },
        { text: 'won a $250M Department of Defense contract', bold: true },
        { text: '. Skilled at designing, developing, testing, and delivering complex, maintainable, resilient web applications with critical requirements for uptime and stability.' },
    ],
    [
        { text: 'I began my career by teaching myself and freelancing simple projects for people I knew. After doing this for 5 years, I landed an engineering role at Beast Code and spent the next 6 years developing software for the Department of Defense, leading development teams, and absorbing the knowledge of those around me. I\'m ready to leave the defense industry and put my skills to work making the world a more peaceful place.' },
    ],
];

export const RESUME_JOBS: ResumeJob[] = [
    {
        dateRange: 'Mar 2024 – Apr 2026',
        title: 'Software Engineer III',
        company: 'Beast Code',
        location: 'Fort Walton Beach, FL',
        bullets: [
            {
                label: 'Led the application frontend team:',
                text: 'Selected to lead a group of engineers for client-side work when our team was split up into designated client & server-side roles.',
            },
            {
                label: 'Team Player:',
                text: 'Conducted daily code review on pull requests; led backlog refinement meetings twice weekly; mentored new engineers; and became known as a "CSS wizard" within the company, assisting even teams that were not my own with styling issues to ensure we all shipped something fantastic.',
            },
            {
                label: 'Collaborated with customers:',
                text: 'Conducted user feedback sessions and participated in design summits at customer facilities nationwide; identified critical feedback ensuring a robust product launch and co-developed a future roadmap for scalable growth.',
            },
            {
                label: 'AI-assisted engineering:',
                text: 'Helped pioneer the company\'s use of privately-hosted LLMs to streamline engineering work, optimize time spent on tasking, and empower engineers to ship higher quality and greater quantities of code more quickly.',
            },
        ],
    },
    {
        dateRange: 'Apr 2022 – Mar 2024',
        title: 'Software Engineer II',
        company: 'Beast Code',
        location: 'Fort Walton Beach, FL',
        bullets: [
            {
                label: 'Created company\'s first component library:',
                text: 'Spearheaded the creation of an internal component library, enhancing software development efficiency, enabling horizontal integration, and promoting visual cohesion between the company\'s many different apps.',
            },
            {
                label: 'Promoted large improvements:',
                text: 'Pioneered the company\'s use of NestJS and MongoDB over older, more incumbent solutions, cutting development time and decreasing friction across multiple teams.',
            },
            {
                label: 'Efficiency driven:',
                text: 'Architected an internal full-stack web application which greatly increased the productivity of another department.',
            },
            {
                label: 'Trusted advocate:',
                text: 'Represented Beast Code in a joint software project with other defense contractors.',
            },
        ],
    },
    {
        dateRange: 'Sep 2019 – Apr 2022',
        title: 'Software Engineer I',
        company: 'Beast Code',
        location: 'Fort Walton Beach, FL',
        bullets: [
            {
                label: 'Hit the ground running:',
                text: 'Eagerly embraced new opportunities at Beast Code, contributing to 2 major project releases -- even pushing a small bug fix on day one.',
            },
            {
                label: 'Well-rounded:',
                text: 'Utilized Vue 2 and .NET as a junior developer.',
            },
            {
                label: 'Impactful performance:',
                text: 'Led the client-side development of MEGA, boosting Naval squadron operational efficiency by enhancing aircraft maintenance tracking and providing clear visibility of maintenance status.',
            },
            {
                label: 'Trend setter:',
                text: 'Participated in the development of applications which would ultimately give Beast Code a reputation for building quality applications quickly.',
            },
        ],
    },
];

export const RESUME_PROJECTS: ResumeProject[] = [
    {
        name: 'jaiden.dev',
        url: 'https://jaiden.dev',
        href: 'https://jaiden.dev',
        image: '/img/resume/jaiden-dot-dev.png',
        description: [
            { text: 'Personal portfolio and freelance business site. Built in NuxtJS and TypeScript.' },
        ],
    },
    {
        name: 'GE Skiller',
        url: 'https://ge-skiller.netlify.app',
        href: 'https://ge-skiller.netlify.app',
        image: '/img/resume/ge-skiller.png',
        description: [
            { text: 'For players of the nostalgic MMORPG ' },
            { text: 'Old School RuneScape', italic: true },
            { text: '. GE Skiller pulls live economy data from the game every hour, compares it to your own character\'s stats, and calculates the most profitable activity your character can do today.' },
        ],
    },
    {
        name: 'LucyVPMS',
        url: 'https://lucy.vet',
        href: 'https://lucy.vet',
        image: '/img/resume/lucy-vpms.png',
        description: [
            { text: 'LucyVPMS, or Veterinary Practice Management System, is a tenancy-based web application for streamlining the entire operating process of a veterinary clinic. Featuring working authentication, RBAC, calendar, inventory, client info, and billing functionality, it is the most complex application I\'ve developed solo.' },
        ],
    },
    {
        name: 'psy-kick',
        url: 'https://psy-kick.me',
        href: 'https://psy-kick.me',
        image: '/img/resume/psy-kick.png',
        description: [
            { text: 'Modeled after real CIA "Remote Viewing" protocols, this app is for testing one\'s ability to psychically "view" some mystery target. Do you believe?' },
        ],
    },
    {
        name: 'UAP Gerb Knowledge Base',
        url: 'https://uapgdb.netlify.app',
        href: 'https://uapgdb.netlify.app',
        image: '/img/resume/uap-gerb-knowledge-base.png',
        description: [
            { text: 'My most recent side project, UAP Gerb Knowledge Base is a wiki that I maintain of all of the major topics covered by the YouTube channel "UAP Gerb." This channel documents the people, organizations, and concepts surrounding the fascinating topic of UFOs.' },
        ],
    },
];

/** Rendered as one flowing comma-separated list. Order is deliberate. */
export const RESUME_SKILLS: string[] = [
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'VueJS',
    'Nuxt',
    'Team Leadership',
    'NodeJS',
    'API Development',
    'Tailwind CSS',
    'Supabase',
    'PostgreSQL',
    'SQL',
    'NestJS',
    'Express.js',
    'MongoDB',
    'Svelte / SvelteKit',
    'Docker',
    'GitHub & GitLab CI/CD pipelines',
    'Unit Testing',
    'Microservices',
    'Web Accessibility',
    'Progressive Web Apps',
    'AI-assisted development',
    'Agentic Programming',
    'Agile Methodologies',
    'Scrum',
    'Angular',
    'C#',
    '.NET',
];

export const RESUME_REFERENCES_CAPTION = 'Phone numbers provided upon request, out of respect for the privacy of my references.';

export const RESUME_REFERENCES: ResumeReference[] = [
    { name: 'Mike Sanders', role: 'CEO, Exploit Technology' },
    { name: 'Jeremy Stephens', role: 'Senior Software Engineer, Beast Code' },
    { name: 'J.D. Compton', role: 'Design Lead, Beast Code' },
    { name: 'Jack Timmons', role: 'Senior Software Engineer, Prado' },
];

export const RESUME_LINKS: ResumeLink[] = [
    { label: 'Portfolio', icon: 'mdi:web', url: 'https://jaiden.dev', href: 'https://jaiden.dev' },
    { label: 'LinkedIn', icon: 'simple-icons:linkedin', url: 'https://www.linkedin.com/in/jaiden-dechon/', href: 'https://www.linkedin.com/in/jaiden-dechon/' },
    { label: 'GitHub', icon: 'simple-icons:github', url: 'github.com/JaidenDeChon', href: 'https://github.com/JaidenDeChon' },
    { label: 'CodePen', icon: 'simple-icons:codepen', url: 'codepen.io/JaidenDeChon', href: 'https://codepen.io/JaidenDeChon' },
];

export const RESUME_HOBBIES: string[] = [
    'Golfing',
    '3D printing',
    'Learning new things',
    'Building fun, novel app ideas',
];

export const RESUME_COURSES: ResumeCourse[] = [
    {
        date: 'Dec 2023',
        title: 'Docker & Kubernetes: The Practical Guide',
        provider: 'Udemy',
    },
    {
        date: 'Nov 2023',
        title: 'MongoDB SI Associate Certification Program',
        provider: 'MongoDB University',
    },
];

export const RESUME_CERTIFICATIONS: ResumeCertification[] = [
    {
        title: 'NestJS Fundamentals',
        provider: 'courses.nestjs.com',
        href: 'https://courses.nestjs.com',
        description: 'NestJS Fundamentals certification.',
        certificateNumber: 'cert_zp7css88',
        completionDate: '12-26-2023',
    },
    {
        title: 'NestJS Advanced Concepts',
        provider: 'courses.nestjs.com',
        href: 'https://courses.nestjs.com',
        description: 'NestJS Advanced Concepts certification.',
        certificateNumber: 'cert_tl1h0dc1',
        completionDate: '12-26-2023',
    },
    {
        title: 'NestJS Authentication & Authorization',
        provider: 'courses.nestjs.com',
        href: 'https://courses.nestjs.com',
        description: 'NestJS Authentication and Authorization certification.',
        certificateNumber: 'cert_j64kq08c',
        completionDate: '12-26-2023',
    },
    {
        title: 'NestJS Architecture & Advanced Patterns',
        provider: 'courses.nestjs.com',
        href: 'https://courses.nestjs.com',
        description: 'NestJS Architecture & Advanced Patterns certification.',
        certificateNumber: 'cert_2mrsw69q',
        completionDate: '12-26-2023',
    },
];
