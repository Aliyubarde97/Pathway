import LetterFlow from '../../../components/LetterFlow';
import { emailLevels, levelOrder } from '../../../lib/letterData';

export default function Email() {
  return (
    <LetterFlow
      title="Email generator"
      shortTitle="Email"
      draftTitle="Your email draft"
      formIntro="Tell us about you and the professor. The more detail, the better your email."
      generateLabel="Generate email"
      levelIntro="Which level are you applying for? The questions change with your choice."
      levels={levelOrder.map((key) => ({ key, config: emailLevels[key] }))}
    />
  );
}