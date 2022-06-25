import { css, styled } from '@ui/styles';

import { CURSOR_EXPIRY_TIMEOUT } from './constants';

export { CursorNametag } from './components/CursorNametag';
export * as CursorConstants from './constants';

export interface CursorProps {
  withTransition?: boolean;
}

const Cursor = styled.div<CursorProps>`
  ${({ withTransition }) =>
    withTransition &&
    css`
      transition: opacity ${CURSOR_EXPIRY_TIMEOUT / 2000}s ease;
    `}
  position: absolute;
  opacity: 1;
  pointer-events: none;

  svg {
    filter: drop-shadow(0 1px 3px rgba(19, 33, 68, 0.12));
  }
`;

export default Cursor;
