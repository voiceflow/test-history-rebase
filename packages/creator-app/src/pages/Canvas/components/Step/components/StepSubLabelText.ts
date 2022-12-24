import { overflowTextStyles } from '@voiceflow/ui';

import { StepLabelVariant } from '@/constants/canvas';
import { styled } from '@/hocs/styled';

import { StepLabelTextProps, textLabelStyles } from './StepLabelText';

export interface StepSubLabelTextProps extends StepLabelTextProps {
  variant?: StepLabelVariant;
}

const StepSubLabelText = styled.div<StepSubLabelTextProps>`
  ${overflowTextStyles}
  ${textLabelStyles}

  font-size: 13px;
  color: ${({ variant = StepLabelVariant.SECONDARY, theme }) => theme.components.blockStep.labelText.variants[variant]};

  > * {
    ${overflowTextStyles}
  }
`;

export default StepSubLabelText;
