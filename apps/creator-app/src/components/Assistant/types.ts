import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

export interface Member extends Realtime.WorkspaceMember {
  role: UserRole.EDITOR | UserRole.VIEWER;
}
