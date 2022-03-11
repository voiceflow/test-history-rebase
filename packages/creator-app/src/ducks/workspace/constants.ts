import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

// eslint-disable-next-line import/prefer-default-export
export const UNKNOWN_MEMBER_DATA: Realtime.DBMember = {
  creator_id: 0,
  seats: 0,
  name: 'User Unavailable',
  email: 'User Unavailable',
  role: UserRole.VIEWER,
  image: '8DA2B5|F2F5F7',
  created: '',
  status: null,
};
