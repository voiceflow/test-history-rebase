import { css, styled, transition } from '@ui/styles';

export const Container = styled.div<{ scrolled?: boolean; stickyHeader?: boolean }>`
  ${transition('box-shadow')};

  position: ${({ stickyHeader }) => (stickyHeader ? 'sticky' : 'relative')};
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  padding: 13px 32px 12px;

  background-color: #fff;

  width: 100%;
  border-bottom: 1px solid #dfe3ed;
  z-index: 2;

  ${({ scrolled }) =>
    scrolled &&
    css`
      box-shadow: 0 0 8px 0 rgb(19 33 68 / 8%);
    `};
`;
