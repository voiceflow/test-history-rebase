import { styled } from '@/hocs';

import { CURSOR_EXPIRY_TIMEOUT } from '../constants';

const RealtimeOverlayCursor = styled.div`
  position: absolute;
  opacity: 1;
  transition: opacity ${CURSOR_EXPIRY_TIMEOUT / 2000}s ease;
  pointer-events: none;
`;

export default RealtimeOverlayCursor;
