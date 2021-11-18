import { css, styled, transition } from '@/hocs';

export const MIN_HEIGHT = 41;

const Container = styled.div<{ isSticky?: boolean; collapsed?: boolean }>`
  ${transition('border-color')}

  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  padding: 10px 16px 6px;
  background-color: #fff;
  border-bottom: solid 1px transparent;
  z-index: 1;

  ${({ isSticky }) =>
    isSticky &&
    css`
      border-color: #dfe3ed;
    `}

  ${({ collapsed }) =>
    collapsed &&
    css`
      padding-bottom: 10px;
    `}
`;

export default Container;
