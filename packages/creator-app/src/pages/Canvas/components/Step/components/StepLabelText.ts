import { overflowTextStyles } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

import { LINE_HEIGHT } from '../constants';

export interface StepLabelTextProps {
  multiline?: boolean;
  lineClamp?: number;
  wordBreak?: boolean;
  withNewLines?: boolean;
}

export const textLabelStyles = css<StepLabelTextProps>`
  ${({ multiline, lineClamp = 3 }) =>
    multiline &&
    css`
      display: -webkit-box;
      max-height: ${LINE_HEIGHT * lineClamp}px;
      white-space: normal;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${lineClamp};
      overflow: hidden;
      word-break: break-word;
    `}

  ${({ withNewLines }) =>
    withNewLines &&
    css`
      white-space: pre-wrap;
    `}

  ${({ wordBreak }) =>
    wordBreak &&
    css`
      word-break: break-all;
    `}
`;

const StepLabelText = styled.div<StepLabelTextProps>`
  ${overflowTextStyles}
  ${textLabelStyles}

  ${({ onClick }) =>
    onClick &&
    css`
      display: inline-flex;
      pointer-events: all;

      :hover {
        color: #4d8de6;
      }
    `}
`;

export default StepLabelText;
