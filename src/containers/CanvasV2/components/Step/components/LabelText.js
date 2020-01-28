import OverflowText from '@/componentsV2/Text/OverflowText';
import { styled } from '@/hocs';

const LabelText = styled(OverflowText)`
  flex: 1;
  color: ${({ variant, theme }) => theme.components.step.labelText.variants[variant]};
`;

export default LabelText;
