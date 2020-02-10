import OverflowText from '@/components/Text/OverflowText';
import { styled } from '@/hocs';

const StepLabelText = styled(OverflowText)`
  flex: 1;
  color: ${({ variant, theme }) => theme.components.step.labelText.variants[variant]};
`;

export default StepLabelText;
