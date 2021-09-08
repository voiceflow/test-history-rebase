import { css, styled } from '@/hocs';

import { CURSOR_EXPIRY_TIMEOUT } from '../constants';

export interface RealtimeOverlayCursorProps {
  withTransition?: boolean;
}

const RealtimeOverlayCursor = styled.div<RealtimeOverlayCursorProps>`
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

export default RealtimeOverlayCursor;
