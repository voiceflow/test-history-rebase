import { css, styled } from '@/styles';

import { CURSOR_EXPIRY_TIMEOUT } from '../constants';

export interface CursorContainerProps {
  /** @deprecated this is no longer needed as the transition is assigned by ref in V2 */
  withTransition?: boolean;
}

export const CursorContainer = styled.div<CursorContainerProps>`
  ${({ withTransition }) =>
    withTransition &&
    css`
      transition: opacity ${CURSOR_EXPIRY_TIMEOUT / 2000}s ease;
    `}
  position: absolute;
  opacity: 1;
  pointer-events: none;

  svg {
    filter: drop-shadow(0 1px 3px rgba(19, 33, 68, 0.08));
  }
`;
