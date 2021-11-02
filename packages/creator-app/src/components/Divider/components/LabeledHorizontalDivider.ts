import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

import { getSimpleDividerStyles } from './SimpleDivider';

export interface LabeledHorizontalDividerProps {
  isLast?: boolean;
}

const LabeledHorizontalDivider = styled(Flex)<LabeledHorizontalDividerProps>`
  margin-bottom: 12px;

  ${({ isLast }) =>
    isLast &&
    css`
      margin-bottom: 0;
      margin-top: 12px;
    `}

  font-size: 13px;
  font-weight: 500;
  color: #8da2b5;
  white-space: nowrap;

  &::before,
  &::after {
    ${getSimpleDividerStyles};

    display: block;
    content: '';
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

export default LabeledHorizontalDivider;
