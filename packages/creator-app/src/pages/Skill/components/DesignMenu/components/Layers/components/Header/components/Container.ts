import { css, styled, transition } from '@/hocs';

export const MIN_HEIGHT = 42;

const Container = styled.div<{ isSticky?: boolean }>`
  ${transition('border-color')}

  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: solid 1px transparent;
  z-index: 1;

  ${({ isSticky }) =>
    isSticky &&
    css`
      border-color: #dfe3ed;
    `}
`;

export default Container;
