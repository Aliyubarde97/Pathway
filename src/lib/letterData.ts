export type LevelKey = 'undergraduate' | 'masters' | 'phd';

export type Field = {
  key: string;
  label: string;
  hint: string;
};

type Answers = Record<string, string>;

// Returns what the student typed, or a [PLACEHOLDER] if they left it empty.
export const val = (a: Answers, key: string, name: string) => a[key]?.trim() || `[${name}]`;

export const levelOrder: LevelKey[] = ['undergraduate', 'masters', 'phd'];

export const sopLevels: Record<
  LevelKey,
  { label: string; description: string; fields: Field[]; build: (a: Answers) => string }
> = {
  undergraduate: {
    label: 'Undergraduate',
    description: 'Bachelor degree application',
    fields: [
      { key: 'university', label: 'University', hint: 'Where are you applying?' },
      { key: 'course', label: 'Intended course', hint: 'e.g. Computer Science' },
      { key: 'results', label: 'JAMB / WAEC results', hint: 'Subjects and scores' },
      { key: 'activities', label: 'Activities and leadership', hint: 'Clubs, projects, awards' },
      { key: 'reason', label: 'Why this school?', hint: 'One or two reasons' },
    ],
    build: (a) =>
      `I am applying to study ${val(a, 'course', 'COURSE')} at ${val(a, 'university', 'UNIVERSITY')}.\n\n` +
      `At school I achieved ${val(a, 'results', 'JAMB / WAEC RESULTS')}. Outside class, ${val(a, 'activities', 'ACTIVITIES AND LEADERSHIP')}, which taught me responsibility and teamwork.\n\n` +
      `I chose ${val(a, 'university', 'UNIVERSITY')} because ${val(a, 'reason', 'YOUR REASON')}. I plan to make the most of every opportunity and contribute to your community.`,
  },
  masters: {
    label: "Master's",
    description: 'Taught or research master',
    fields: [
      { key: 'university', label: 'University', hint: 'Where are you applying?' },
      { key: 'programme', label: 'Target programme', hint: 'e.g. MSc Data Science' },
      { key: 'degree', label: 'Bachelor degree and CGPA', hint: 'e.g. BSc Physics, 4.2 / 5' },
      { key: 'experience', label: 'Work or research experience', hint: 'Roles and results' },
      { key: 'goal', label: 'Career goal', hint: 'Where this degree takes you' },
    ],
    build: (a) =>
      `I am applying to the ${val(a, 'programme', 'PROGRAMME')} at ${val(a, 'university', 'UNIVERSITY')}. I hold ${val(a, 'degree', 'DEGREE AND CGPA')}.\n\n` +
      `My relevant experience includes ${val(a, 'experience', 'YOUR EXPERIENCE')}. This experience showed me the areas I want to study further.\n\n` +
      `I chose this programme because it fits my goal: ${val(a, 'goal', 'CAREER GOAL')}. I am ready to contribute to your cohort and learn from it.`,
  },
  phd: {
    label: 'PhD',
    description: 'Doctoral research position',
    fields: [
      { key: 'university', label: 'University', hint: 'Where are you applying?' },
      { key: 'topic', label: 'Research topic or proposal', hint: 'Your question in one line' },
      { key: 'publications', label: 'Publications and projects', hint: 'Papers, thesis, posters' },
      { key: 'supervisor', label: 'Target supervisor', hint: 'Name and why' },
      { key: 'funding', label: 'Funding plan', hint: 'Scholarship or assistantship' },
    ],
    build: (a) =>
      `I am applying for a PhD at ${val(a, 'university', 'UNIVERSITY')}. I want to investigate ${val(a, 'topic', 'RESEARCH TOPIC')}.\n\n` +
      `My previous work includes ${val(a, 'publications', 'PUBLICATIONS AND PROJECTS')}. I am drawn to the work of ${val(a, 'supervisor', 'SUPERVISOR')}, which closely matches my research interests.\n\n` +
      `I plan to fund my studies through ${val(a, 'funding', 'FUNDING PLAN')}. I am committed to completing a rigorous doctoral programme.`,
  },
};

export type LetterConfig = {
  label: string;
  description: string;
  icon?: string;
  fields: Field[];
  build: (a: Answers) => string;
};

export const emailLevels: Record<LevelKey, LetterConfig> = {
  undergraduate: {
    label: 'Undergraduate',
    description: 'Enquiry to a department or professor',
    icon: 'school-outline',
    fields: [
      { key: 'recipient', label: 'Professor or department', hint: 'e.g. Admissions office' },
      { key: 'programme', label: 'Course and university', hint: 'What and where' },
      { key: 'results', label: 'Your results', hint: 'JAMB / WAEC scores' },
      { key: 'question', label: 'Question you want to ask', hint: 'One clear question' },
    ],
    build: (a) =>
      `Subject: Enquiry about ${val(a, 'programme', 'COURSE AND UNIVERSITY')}\n\n` +
      `Dear ${val(a, 'recipient', 'PROFESSOR OR DEPARTMENT')},\n\n` +
      `My name is [YOUR NAME]. I am applying to study ${val(a, 'programme', 'COURSE AND UNIVERSITY')}. I achieved ${val(a, 'results', 'YOUR RESULTS')}.\n\n` +
      `I would like to ask: ${val(a, 'question', 'YOUR QUESTION')}\n\n` +
      `Thank you for your time.\n\nKind regards,\n[YOUR NAME]`,
  },
  masters: {
    label: "Master's",
    description: 'First email to a possible supervisor',
    icon: 'ribbon-outline',
    fields: [
      { key: 'professor', label: "Professor's name", hint: 'e.g. Smith' },
      { key: 'university', label: 'University', hint: 'Where does the professor work?' },
      { key: 'degree', label: 'Your degree and CGPA', hint: 'e.g. BSc Physics, 4.2 / 5' },
      { key: 'interest', label: 'Research area that matches theirs', hint: 'Paper or topic of theirs' },
      { key: 'programme', label: 'Programme and intake', hint: 'e.g. MSc, September 2027' },
    ],
    build: (a) =>
      `Subject: Master's application: ${val(a, 'interest', 'RESEARCH AREA')}\n\n` +
      `Dear Professor ${val(a, 'professor', 'NAME')},\n\n` +
      `I am [YOUR NAME], a graduate with ${val(a, 'degree', 'DEGREE AND CGPA')}. I read your work and I am very interested in ${val(a, 'interest', 'RESEARCH AREA')}.\n\n` +
      `I plan to apply to ${val(a, 'programme', 'PROGRAMME AND INTAKE')} at ${val(a, 'university', 'UNIVERSITY')}. I have attached my CV and transcript. Would you have time for a short conversation?\n\n` +
      `Kind regards,\n[YOUR NAME]`,
  },
  phd: {
    label: 'PhD',
    description: 'Enquiry about a doctoral position',
    icon: 'flask-outline',
    fields: [
      { key: 'professor', label: "Professor's name", hint: 'e.g. Smith' },
      { key: 'university', label: 'University', hint: 'Where does the professor work?' },
      { key: 'thesis', label: 'Your thesis or main research', hint: 'Title and result' },
      { key: 'topic', label: 'Research topic you propose', hint: 'Your question in one line' },
      { key: 'funding', label: 'Funding and intake', hint: 'Scholarship and start date' },
    ],
    build: (a) =>
      `Subject: PhD enquiry: ${val(a, 'topic', 'RESEARCH TOPIC')}\n\n` +
      `Dear Professor ${val(a, 'professor', 'NAME')},\n\n` +
      `I am [YOUR NAME]. My previous work, ${val(a, 'thesis', 'THESIS OR MAIN RESEARCH')}, closely matches your research. I would like to work on ${val(a, 'topic', 'RESEARCH TOPIC')}.\n\n` +
      `Are you accepting PhD students at ${val(a, 'university', 'UNIVERSITY')}, with funding through ${val(a, 'funding', 'FUNDING AND INTAKE')}? I have attached my CV and a short research proposal.\n\n` +
      `Kind regards,\n[YOUR NAME]`,
  },
};

export const cvConfig: LetterConfig = {
  label: 'CV',
  description: 'Build a CV for jobs or applications',
  fields: [
    { key: 'name', label: 'Full name', hint: 'As on your documents' },
    { key: 'contact', label: 'Contact', hint: 'Email, phone, city' },
    { key: 'profile', label: 'Profile', hint: 'Two lines about who you are and what you want next' },
    { key: 'education', label: 'Education', hint: 'Degree, school, years, CGPA' },
    { key: 'experience', label: 'Work experience', hint: 'Role, organisation, years, what you achieved' },
    { key: 'skills', label: 'Skills', hint: 'Separate with commas' },
  ],
  build: (a) => {
    const skills = a.skills?.trim()
      ? a.skills.split(',').map((s) => s.trim()).filter(Boolean).join(' · ')
      : '[SKILLS]';

    return (
      `${val(a, 'name', 'YOUR FULL NAME')}\n` +
      `${val(a, 'contact', 'EMAIL · PHONE · CITY')}\n\n` +
      `PROFILE\n${val(a, 'profile', 'TWO LINES ABOUT YOU')}\n\n` +
      `EDUCATION\n${val(a, 'education', 'DEGREE, SCHOOL, YEARS')}\n\n` +
      `EXPERIENCE\n${val(a, 'experience', 'ROLE, ORGANISATION, YEARS, ACHIEVEMENTS')}\n\n` +
      `SKILLS\n${skills}`
    );
  },
};

export const coverLetterConfig: LetterConfig = {
  label: 'Cover letter',
  description: 'Cover letter for a job or internship application',
  fields: [
    { key: 'job', label: 'Job title', hint: 'e.g. Data Analyst' },
    { key: 'company', label: 'Company name', hint: 'Where are you applying?' },
    { key: 'manager', label: "Hiring manager's name (optional)", hint: 'Leave empty if you do not know it' },
    { key: 'experience', label: 'Your relevant experience', hint: 'Roles, projects and results' },
    { key: 'skills', label: 'Skills that match the job', hint: 'e.g. Excel, SQL, teamwork' },
    { key: 'why', label: 'Why this company?', hint: 'One or two reasons' },
  ],
  build: (a) => {
    const manager = a.manager?.trim() || 'Hiring Manager';
    return (
      `[YOUR NAME]\n[YOUR CONTACT DETAILS]\n\n[DATE]\n\n` +
      `Dear ${manager},\n\n` +
      `I am writing to apply for the ${val(a, 'job', 'JOB TITLE')} position at ${val(a, 'company', 'COMPANY')}.\n\n` +
      `My relevant experience includes ${val(a, 'experience', 'YOUR EXPERIENCE')}. I bring skills in ${val(a, 'skills', 'YOUR SKILLS')}, which match what this role requires.\n\n` +
      `I am particularly drawn to ${val(a, 'company', 'COMPANY')} because ${val(a, 'why', 'YOUR REASON')}. I would welcome the chance to discuss how I can contribute to your team.\n\n` +
      `Thank you for your time and consideration.\n\n` +
      `Yours sincerely,\n[YOUR NAME]`
    );
  },
};