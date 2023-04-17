import { css, styled } from '@/hocs/styled';

import { defaultTextStyles } from '../styles';

const UnstyledText = styled.span<{ isPlaceholder?: boolean }>`
  ${defaultTextStyles}
  ${({ isPlaceholder }) =>
    isPlaceholder &&
    css`
      color: #8da2b5;
    `}
`;

export default UnstyledText;
