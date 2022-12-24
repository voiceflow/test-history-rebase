import { css, styled } from '@/hocs/styled';

const HoverContainer = styled.div<{ readOnlyMode: boolean }>`
  :not(:last-of-type) {
    padding-bottom: 6px;
  }

  ${({ readOnlyMode }) =>
    readOnlyMode &&
    css`
      pointer-events: none;
    `}
`;

export default HoverContainer;
