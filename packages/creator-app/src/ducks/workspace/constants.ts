import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

export const UNKNOWN_MEMBER_DATA: Realtime.WorkspaceMember = {
  creator_id: 0,
  role: UserRole.VIEWER,
  name: 'User Unavailable',
  email: 'User Unavailable',
  image: '8DA2B5|F2F5F7',
  created: '',
};
