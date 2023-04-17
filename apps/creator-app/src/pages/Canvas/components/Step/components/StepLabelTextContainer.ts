import { OverflowText } from '@voiceflow/ui';

import { StepLabelVariant } from '@/constants/canvas';
import { styled } from '@/hocs/styled';

export interface StepLabelTextContainerProps {
  variant?: StepLabelVariant;
}

const StepLabelTextContainer = styled(OverflowText)<StepLabelTextContainerProps>`
  flex: 1;
  color: ${({ variant = StepLabelVariant.PRIMARY, theme }) => theme.components.blockStep.labelText.variants[variant]};
`;

export default StepLabelTextContainer;
