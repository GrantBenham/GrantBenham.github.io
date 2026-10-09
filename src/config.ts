/** All site identity, navigation, and deployment settings live here. */
export const site = {
  name: 'Grant Benham, Ph.D.',
  role: 'Professor of Psychological Science',
  institution: 'The University of Texas Rio Grande Valley',
  location: 'Edinburg, Texas',
  email: 'grant.benham@utrgv.edu',
  labName: 'Stress, Sleep, & Health Lab',
  description: 'Research on psychological stress, sleep, sensory processing sensitivity, and health. The academic website of Grant Benham, Ph.D., at UTRGV.',
  url: 'https://grantbenham.github.io',
  // GitHub user-site repository; an empty base serves pages at the domain root.
  base: '',
  repository: 'GrantBenham/GrantBenham.github.io',
  portrait: '/images/grant-benham-cutout.webp',
  portraitSmall: '/images/grant-benham-cutout-420.webp',
  portraitWidth: 840,
  portraitHeight: 684,
  cv: '/documents/Grant-Benham-CV-2026-10.docx',
  cvLabel: 'Download CV (DOCX, October 2026)',
  scholar: 'https://scholar.google.com/citations?user=OT4muuUAAAAJ',
  github: 'https://github.com/GrantBenham',
  legacy: 'https://stresslab.weebly.com/',
  nav: [
    {label: 'Home', path: '/'},
    {label: 'Research', path: '/research/'},
    {label: 'Publications', path: '/publications/'},
    {label: 'Presentations', path: '/presentations/'},
    {label: 'Lab', path: '/lab/'},
    {label: 'Teaching', path: '/teaching/'},
    {label: 'Software', path: '/software/'},
  ],
} as const;

/** Prefix every local link and asset for GitHub project Pages. */
export const localUrl = (path: string) => `${site.base}${path.startsWith('/') ? path : `/${path}`}`;
