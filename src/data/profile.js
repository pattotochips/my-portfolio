/**
 * Single source of truth for identity, contact links, and CV content.
 * Landing pages and the home page both read from here so nothing drifts.
 */

export const profile = {
  name: 'Prabhat Kumar Singh',
  role: 'Full-Stack Software Engineer',
  tagline: '8+ years building data-driven web applications, from the React interfaces people use down to the Java, Spring Boot, and Node.js services behind them.',
  location: 'Noida, India',
  email: 'prabhatkumarsingh336@gmail.com',
  linkedin: 'https://www.linkedin.com/in/prabhat-singh-1394n/',
  github: 'https://github.com/pattotochips',
  resume: 'Prabhat_Kumar_Singh_Resume.pdf',
  portrait: 'portrait.webp',
  // avatar.png is kept for the favicon — a face is unreadable at 16px.
  avatar: 'avatar.png',
  about: [
    "I work across the full stack, though React and UI architecture are where I spend most of my time. The rest goes into the services underneath: Java and Spring Boot, Node.js REST APIs, and the data models they sit on. Having built both sides makes it much easier to design an API the front end actually wants to use.",
    "Much of my career has been modernization work \u2014 moving large, long-lived codebases onto current stacks without breaking the things people rely on. In practice that means adding tests where there weren't any, untangling old UI layers, and tracking down performance problems that had been there for years.",
    "Along the way I've mentored engineers, owned features from first design through release, and become the person a team hands its hardest bugs to. I'm at my best on the awkward problems where the answer isn't obvious yet.",
  ],
};

export const skills = [
  {
    category: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Java', 'HTML5', 'CSS3', 'COBOL (z/OS)'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Redux', 'Flux', 'Material UI', 'Tailwind CSS', 'Next.js', 'Bootstrap', 'Canvas API'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'Spring Boot', 'REST API design', 'WebRTC'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'Oracle', 'MySQL', 'DB2 for z/OS', 'Firestore'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'Jira', 'Postman', 'Heroku', 'Netlify', 'GitHub Actions', 'IntelliJ IDEA'],
  },
  {
    category: 'Practices',
    items: [
      'Frontend architecture',
      'Legacy modernization',
      'Performance optimization',
      'Mentoring',
      'AI-assisted development',
    ],
  },
];

export const experience = [
  {
    company: 'Evertrue',
    employer: 'Netsmartz Infotech',
    location: 'Noida',
    period: 'Sep 2023 — Present',
    current: true,
    stack: ['React', 'JavaScript', 'Flux', 'Google Maps JS API', 'Java'],
    highlights: [
      'Led major improvements to Google Maps–based features across core workflows, supporting thousands of user interactions daily.',
      'Designed and built REST APIs powering the web app and the iOS/Android apps for an advancement platform used by 2,000+ nonprofit and education customers, including 1,000+ universities and schools.',
      'Created a structured testing and modernization framework for legacy UI components that the team adopted as a reference model.',
      'Delivered advanced filtering that removed prior technical constraints and unlocked new data-rich workflows.',
      'Go-to engineer for complex debugging across UI logic, data flows, and third-party integrations.',
    ],
  },
  {
    company: 'Vidsig',
    employer: 'Netsmartz Infotech',
    location: 'Noida',
    period: 'Jul 2023 — Sep 2023',
    stack: ['React', 'TypeScript', 'Express', 'Handlebars', 'Bootstrap'],
    highlights: [
      'Sole owner of frontend for a global video chat platform — both the end-user web app and the internal admin dashboard.',
      'Built purchase flows for one-to-one sessions plus expert onboarding, translating high-level requirements into working interfaces.',
      'Led UI/UX decisions for both portals in the absence of predefined designs.',
    ],
  },
  {
    company: 'Aquant',
    employer: 'Netsmartz Infotech',
    location: 'Noida',
    period: 'Nov 2021 — Jun 2023',
    stack: ['Java', 'React', 'HTML Canvas', 'WebRTC', 'Heroku'],
    highlights: [
      'Full-stack across React and Java on a video conferencing app connecting customers with field technicians for live troubleshooting.',
      'Led canvas-based video call features — annotations, filters, enhanced controls, and recording — with no prior canvas experience.',
      'Built Java services and REST APIs for an enterprise video-triage platform used by global field-service teams in industrial and medtech.',
      'Owned deployment and environment management across QA, staging, and production on Heroku.',
    ],
  },
  {
    company: 'Appify',
    employer: 'Netsmartz Infotech',
    location: 'Noida',
    period: 'Aug 2021 — Nov 2021',
    stack: ['React', 'TypeScript', 'Redux', 'Bootstrap'],
    highlights: [
      'Led frontend across a web application maintained in three parallel repositories, each with distinct UI layers.',
      'Resolved 10+ bugs weekly across multiple client-owned applications while keeping sprint delivery on track.',
    ],
  },
  {
    company: 'CalSAWS',
    employer: 'Deloitte',
    location: 'Bengaluru',
    period: 'Dec 2019 — May 2021',
    stack: ['React', 'Java', 'Spring Boot', 'Oracle → PostgreSQL'],
    highlights: [
      'Worked across frontend and backend on the statewide platform consolidating California’s 58-county welfare eligibility systems, serving 13M+ residents.',
      'Supported a major modernization effort migrating legacy systems to Spring Boot, React, and PostgreSQL.',
      'Onboarded new joiners as part of the core engineering team, reviewing output and unblocking issues.',
    ],
  },
  {
    company: 'Anthem',
    employer: 'Deloitte',
    location: 'Bengaluru',
    period: 'Aug 2017 — Dec 2019',
    stack: ['COBOL', 'IBM Mainframe', 'z/OS', 'DB2'],
    highlights: [
      'Maintained and debugged legacy COBOL on z/OS supporting large-scale healthcare claim processing.',
      'Diagnosed failed claim transactions, separating code defects from data inconsistencies and business-rule violations.',
      'Implemented performance and process improvements worth roughly $77K in annual savings.',
    ],
  },
];

export const education = [
  {
    institution: 'Amity University',
    qualification: 'Bachelor of Computer Applications',
    detail: 'CGPA 8.3',
    year: '2017',
  },
  {
    institution: 'DAV Kapil Dev Public School',
    qualification: 'Class 12 (CBSE)',
    detail: '65%',
    year: '2014',
  },
  {
    institution: 'St. Francis School',
    qualification: 'Class 10 (ICSE)',
    detail: '90%',
    year: '2012',
  },
];

export const repos = {
  portfolio: 'https://github.com/pattotochips/my-portfolio',
  faceFilter: 'https://github.com/pattotochips/face-filter-app',
  expenseSplitter: 'https://github.com/pattotochips/expense-splitter',
  oooGenerator: 'https://github.com/pattotochips/OOO-generator',
  birthdayBot: 'https://github.com/pattotochips/bot',
  hrBackend: 'https://github.com/pattotochips/HR-Query-Engine---Backend',
  hrFrontend: 'https://github.com/pattotochips/HR-Query-Engine--Frontend',
  wikiTrail: 'https://github.com/pattotochips/WikiTrail',
  inkmark: 'https://github.com/pattotochips/inkmark',
  travisFilter: 'https://github.com/pattotochips/travis-filter',
  deepAr: 'https://github.com/pattotochips/deep-ar-demo',
};
