import LetterFlow from '../../../components/LetterFlow';
import { cvConfig } from '../../../lib/letterData';

export default function Cv() {
  return (
    <LetterFlow
      title="CV generator"
      shortTitle="CV"
      draftTitle="Your CV draft"
      formIntro="Fill in the basics. You can edit everything in the draft afterwards."
      generateLabel="Generate CV"
      single={cvConfig}
    />
  );
}