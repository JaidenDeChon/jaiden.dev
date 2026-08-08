<script setup lang="ts">
// Self-hosted faces, loaded with this route rather than site-wide. Only the
// weights the document actually uses are pulled in.
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-400-italic.css';
import '@fontsource/ibm-plex-sans/latin-700.css';
import '~/assets/css/resume.css';

import {
    RESUME_CERTIFICATIONS,
    RESUME_COURSES,
    RESUME_HOBBIES,
    RESUME_JOBS,
    RESUME_PROJECTS,
    RESUME_REFERENCES,
    RESUME_REFERENCES_CAPTION,
    RESUME_SUMMARY,
} from '~/lib/data/resume';

useSharePreview({
    title: 'Résumé — jaiden.dev',
    description: 'The résumé of Jaiden DeChon — a web developer focused on performance and accessibility.',
});

/**
 * Content is paginated by hand, the way the original was — nothing reflows
 * across sheets on its own. These slices are the only knobs: they decide which
 * entries land on which page. If copy grows, adjust them (and re-run
 * `bun run resume:pdf`, which fails loudly if a column overflows) rather than
 * letting a section break unpredictably.
 *
 * Employment history is never split mid-entry; Projects is the one section
 * that spans a page boundary, and it does so between whole project entries.
 */
const PAGE_ONE_JOBS = RESUME_JOBS.slice(0, 1);
const PAGE_TWO_JOBS = RESUME_JOBS.slice(1);
const PAGE_TWO_PROJECTS = RESUME_PROJECTS.slice(0, 2);
const PAGE_THREE_PROJECTS = RESUME_PROJECTS.slice(2);

useHead({
    // Scopes the print rules that suppress the site header/footer.
    bodyAttrs: { class: 'resume-route' },
});
</script>

<template>
    <main class="resume-shell">
        <div class="resume-column">
            <div class="resume-toolbar mb-6 flex items-center justify-between gap-4">
                <p class="afacad text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Résumé
                </p>

                <resume-download-button />
            </div>

            <div class="resume-document">
                <!-- Page 1 — header, skills and references alongside the summary
                     and the first employment entry. -->
                <resume-page>
                    <template #sidebar>
                        <resume-header />

                        <resume-section
                            title="Skills"
                            column="sidebar"
                        >
                            <resume-skills />
                        </resume-section>

                        <resume-section
                            title="References"
                            column="sidebar"
                            :caption="RESUME_REFERENCES_CAPTION"
                        >
                            <resume-reference
                                v-for="reference in RESUME_REFERENCES"
                                :key="reference.name"
                                :reference="reference"
                            />
                        </resume-section>
                    </template>

                    <resume-section column="main">
                        <p
                            v-for="(paragraph, index) in RESUME_SUMMARY"
                            :key="index"
                            class="resume-summary__paragraph"
                        >
                            <resume-rich-text :runs="paragraph" />
                        </p>
                    </resume-section>

                    <resume-section
                        title="Employment history"
                        column="main"
                    >
                        <resume-job
                            v-for="job in PAGE_ONE_JOBS"
                            :key="job.title"
                            :job="job"
                        />
                    </resume-section>
                </resume-page>

                <!-- Page 2 — remaining employment entries, then the start of
                     Projects. -->
                <resume-page>
                    <template #sidebar>
                        <resume-section
                            title="Links"
                            column="sidebar"
                        >
                            <resume-links />
                        </resume-section>

                        <resume-section
                            title="Hobbies"
                            column="sidebar"
                        >
                            <resume-bullets :items="RESUME_HOBBIES" />
                        </resume-section>

                        <resume-section
                            title="Courses"
                            column="sidebar"
                        >
                            <resume-course
                                v-for="course in RESUME_COURSES"
                                :key="course.title"
                                :course="course"
                            />
                        </resume-section>
                    </template>

                    <resume-section column="main">
                        <resume-job
                            v-for="job in PAGE_TWO_JOBS"
                            :key="job.title"
                            :job="job"
                        />
                    </resume-section>

                    <resume-section
                        title="Projects"
                        column="main"
                    >
                        <resume-project
                            v-for="project in PAGE_TWO_PROJECTS"
                            :key="project.name"
                            :project="project"
                        />
                    </resume-section>
                </resume-page>

                <!-- Page 3 — the tail of Projects, with the credentials
                     sections carried down the sidebar. -->
                <resume-page>
                    <template #sidebar>
                        <resume-section
                            title="Certifications"
                            column="sidebar"
                        >
                            <resume-certification
                                v-for="certification in RESUME_CERTIFICATIONS"
                                :key="certification.certificateNumber"
                                :certification="certification"
                            />
                        </resume-section>
                    </template>

                    <resume-section column="main">
                        <resume-project
                            v-for="project in PAGE_THREE_PROJECTS"
                            :key="project.name"
                            :project="project"
                        />
                    </resume-section>
                </resume-page>
            </div>

            <!-- Centred rather than justified: unlike the toolbar above, this
                 one has no label to sit opposite. -->
            <div class="resume-actions mt-8 flex justify-center">
                <resume-download-button />
            </div>
        </div>
    </main>
</template>
