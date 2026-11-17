export type Question = {
  id: string;
  kind: 'objective' | 'text';
  text: string;
  options?: string[];
  correct?: number;
  solution: string;
};

const LETTERS = ['A', 'B', 'C', 'D'];
export const letter = (i: number) => LETTERS[i];

const bank: Record<string, Question[]> = {
  Mathematics: [
    { id: 'm1', kind: 'objective', text: 'If 2x + 3 = 11, find the value of x.', options: ['2', '4', '6', '8'], correct: 1,
      solution: '2x + 3 = 11\n2x = 11 − 3 = 8\nx = 8 ÷ 2 = 4' },
    { id: 'm2', kind: 'objective', text: 'Simplify 3(2x − 1) − 2(x − 4).', options: ['4x + 5', '4x − 11', '8x + 5', '8x − 11'], correct: 0,
      solution: '3(2x − 1) = 6x − 3\n2(x − 4) = 2x − 8\n6x − 3 − 2x + 8 = 4x + 5' },
    { id: 'm3', kind: 'objective', text: 'Evaluate 5² + 3³ − √16.', options: ['44', '48', '52', '56'], correct: 1,
      solution: '5² = 25 and 3³ = 27\n√16 = 4\n25 + 27 − 4 = 48' },
    { id: 'm4', kind: 'text', text: 'Solve the quadratic equation x² − 5x + 6 = 0.',
      solution: 'Find two numbers that multiply to 6 and add to −5. They are −2 and −3.\n(x − 2)(x − 3) = 0\nSo x = 2 or x = 3.' },
  ],
  'English Language': [
    { id: 'e1', kind: 'objective', text: 'Choose the word nearest in meaning to "benevolent".', options: ['kind', 'cruel', 'lazy', 'proud'], correct: 0,
      solution: 'Benevolent means well-meaning and generous.\nThe closest option is "kind".' },
    { id: 'e2', kind: 'objective', text: 'Neither of the boys ___ present.', options: ['are', 'were', 'is', 'have'], correct: 2,
      solution: '"Neither" takes a singular verb.\nSo the answer is "is".' },
    { id: 'e3', kind: 'objective', text: 'Choose the word opposite in meaning to "scarce".', options: ['rare', 'plentiful', 'costly', 'small'], correct: 1,
      solution: 'Scarce means in short supply.\nIts opposite is "plentiful".' },
    { id: 'e4', kind: 'text', text: 'Write a short letter to your principal asking for permission to attend a school competition.',
      solution: 'Model answer outline:\n• Your address and the date at the top right\n• The principal title and the school address on the left\n• Greeting: Dear Sir or Madam\n• Heading: Request for permission to attend the competition\n• Body: what the competition is, when and where it holds, and why you want to go\n• Closing: Yours faithfully, then your name and class' },
  ],
  Physics: [
    { id: 'p1', kind: 'objective', text: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1,
      solution: 'Force = mass × acceleration, measured in kg·m/s².\nThis unit is called the newton.' },
    { id: 'p2', kind: 'objective', text: 'A car covers 100 m in 5 s at constant speed. What is its speed?', options: ['20 m/s', '50 m/s', '500 m/s', '0.05 m/s'], correct: 0,
      solution: 'Speed = distance ÷ time\n100 ÷ 5 = 20 m/s' },
    { id: 'p3', kind: 'objective', text: 'The SI unit of electrical resistance is the', options: ['volt', 'ampere', 'ohm', 'watt'], correct: 2,
      solution: 'Resistance = voltage ÷ current.\nIts unit is the ohm.' },
    { id: 'p4', kind: 'text', text: 'State the law that relates force, mass and acceleration, and give its formula.',
      solution: 'The second law of motion: the acceleration of an object depends on the force acting on it and on its mass.\nFormula: F = m × a\nF is the force in newtons, m is the mass in kg, and a is the acceleration in m/s².' },
  ],
  Chemistry: [
    { id: 'c1', kind: 'objective', text: 'What is the chemical symbol for sodium?', options: ['S', 'So', 'Na', 'N'], correct: 2,
      solution: 'Sodium comes from the Latin name "natrium".\nIts symbol is Na.' },
    { id: 'c2', kind: 'objective', text: 'What is the pH of a neutral solution at 25 °C?', options: ['0', '7', '14', '1'], correct: 1,
      solution: 'Acids are below 7 and bases are above 7.\nA neutral solution is exactly 7.' },
    { id: 'c3', kind: 'objective', text: 'The atomic number of an element is the number of', options: ['neutrons', 'protons', 'nucleons', 'electron shells'], correct: 1,
      solution: 'Atomic number = the number of protons in the nucleus.' },
  ],
  Biology: [
    { id: 'b1', kind: 'objective', text: 'Which part of the cell is called its powerhouse?', options: ['nucleus', 'ribosome', 'mitochondrion', 'vacuole'], correct: 2,
      solution: 'Mitochondria release energy from food.\nThey are the powerhouse of the cell.' },
    { id: 'b2', kind: 'objective', text: 'The process by which green plants make food is', options: ['respiration', 'digestion', 'photosynthesis', 'excretion'], correct: 2,
      solution: 'Plants use light, water and carbon dioxide to make food.\nThis process is photosynthesis.' },
    { id: 'b3', kind: 'objective', text: 'Which blood vessels carry blood away from the heart?', options: ['veins', 'arteries', 'capillaries', 'venules'], correct: 1,
      solution: 'Arteries carry blood away from the heart.\nVeins carry it back.' },
    { id: 'b4', kind: 'text', text: 'Describe the process of photosynthesis and write its word equation.',
      solution: 'Photosynthesis is how green plants make food using light energy.\nWord equation:\ncarbon dioxide + water → glucose + oxygen (with light and chlorophyll)\nIt happens in the chloroplasts of the leaves.' },
  ],
};

export function getQuestions(subject: string): Question[] {
  return (
    bank[subject] ??
    [1, 2, 3].map((n) => ({
      id: `${subject}-${n}`,
      kind: 'objective' as const,
      text: `[Question ${n} for ${subject}]`,
      options: ['[Option A]', '[Option B]', '[Option C]', '[Option D]'],
      correct: 0,
      solution: '[Working appears here]',
    }))
  );
}