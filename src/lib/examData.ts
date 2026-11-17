export type ExamKey = 'jamb' | 'waec' | 'neco';

export const examOrder: ExamKey[] = ['jamb', 'waec', 'neco'];

export const exams: Record<ExamKey, { name: string; description: string }> = {
  jamb: { name: 'JAMB', description: 'Objective and essay past questions by year and subject' },
  waec: { name: 'WAEC', description: 'Objective and theory past questions by year and subject' },
  neco: { name: 'NECO', description: 'Objective and theory past questions by year and subject' },
};

export const subjects = [
  'English Language',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Government',
  'Literature in English',
];

export const years = [
  '2025', '2024', '2023', '2022', '2021', '2020',
  '2019', '2018', '2017', '2016', '2015',
  'Mixed years',
];