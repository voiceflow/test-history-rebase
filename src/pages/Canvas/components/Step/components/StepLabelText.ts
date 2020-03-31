import { overflowTextStyles } from '@/components/Text/OverflowText';
import { css, styled } from '@/hocs';

import { LINE_HEIGHT } from '../constants';

export type StepLabelTextProps = {
  multiline?: boolean;
  lineClamp?: number;
};

const StepLabelText = styled.div<StepLabelTextProps>`

${overflowTextStyles}
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
      display: inline-flex;
      :hover {
        color: #4d8de6;
      }
    `}
`;

export default StepLabelText;
