import LetterFlow from '../../../components/LetterFlow';
import { levelOrder, sopLevels } from '../../../lib/letterData';

const icons = {
  undergraduate: 'school-outline',
  masters: 'ribbon-outline',
  phd: 'flask-outline',
} as const;

export default function Sop() {
  return (
    <LetterFlow
      title="SOP generator"
      shortTitle="SOP"
      draftTitle="Your SOP draft"
      formIntro="Tell us about you. The more detail, the better your SOP."
      generateLabel="Generate SOP"
      levelIntro="Which level are you applying for? The questions change with your choice."
      levels={levelOrder.map((key) => ({ key, config: { ...sopLevels[key], icon: icons[key] } }))}
    />
  );
}