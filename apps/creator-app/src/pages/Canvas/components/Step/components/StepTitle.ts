import { overflowTextStyles } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { LINE_HEIGHT } from '../constants';

export interface StepTitleProps {
  multiline?: boolean;
  lineClamp?: number;
  wordBreak?: boolean;
  withNewLines?: boolean;
  color?: string;
}

export const textLabelStyles = css<StepTitleProps>`
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

const StepTitle = styled.div<StepTitleProps>`
  ${overflowTextStyles}
  ${textLabelStyles}
	color: #132144;

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

export default StepTitle;
