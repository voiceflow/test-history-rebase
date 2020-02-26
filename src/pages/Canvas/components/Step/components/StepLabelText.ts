import OverflowText from '@/components/Text/OverflowText';
import { StepLabelVariant } from '@/constants/canvas';
import { css, styled } from '@/hocs';

import { LINE_HEIGHT } from '../constants';

export type StepLabelTextProps = {
  variant: StepLabelVariant;
  multiline?: boolean;
  lineClamp?: number;
};

const StepLabelText = styled(OverflowText)<StepLabelTextProps>`
  flex: 1;
  color: ${({ variant, theme }) => theme.components.blockStep.labelText.variants[variant]};

  ${({ multiline, lineClamp = 3 }) =>
    multiline &&
    css`
      display: -webkit-box;
      max-height: ${LINE_HEIGHT * lineClamp}px;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${lineClamp};
    `}

  ${({ onClick }) =>
    onClick &&
    css`
      :hover {
        color: #4d8de6;
      }
    `}
`;

export default StepLabelText;
