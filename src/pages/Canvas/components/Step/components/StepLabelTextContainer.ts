import OverflowText from '@/components/Text/OverflowText';
import { StepLabelVariant } from '@/constants/canvas';
import { styled } from '@/hocs';

export type StepLabelTextContainerProps = {
  variant: StepLabelVariant;
};

const StepLabelTextContainer = styled(OverflowText)<StepLabelTextContainerProps>`
  flex: 1;
  color: ${({ variant, theme }) => theme.components.blockStep.labelText.variants[variant]};
`;

export default StepLabelTextContainer;
