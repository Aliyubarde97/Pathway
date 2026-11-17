import LetterFlow from '../../../components/LetterFlow';
import { coverLetterConfig } from '../../../lib/letterData';

export default function CoverLetter() {
  return (
    <LetterFlow
      title="Cover letter generator"
      shortTitle="Cover letter"
      draftTitle="Your cover letter draft"
      formIntro="Tell us about the job and about you. The more detail, the better your letter."
      generateLabel="Generate cover letter"
      single={coverLetterConfig}
    />
  );
}