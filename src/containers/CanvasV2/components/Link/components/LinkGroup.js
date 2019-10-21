import { css, styled } from '@/hocs';

const LinkGroup = styled.g`
  ${({ isVisible }) =>
    !isVisible &&
    css`
      visibility: hidden;
    `}
`;

export default LinkGroup;
