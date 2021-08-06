import { overflowTextStyles } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

import { LINE_HEIGHT } from '../constants';

export interface StepLabelTextProps {
  multiline?: boolean;
  lineClamp?: number;
  withNewLines?: boolean;
}

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


  ${({ withNewLines }) =>
    withNewLines &&
    css`
      white-space: pre-wrap;
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
