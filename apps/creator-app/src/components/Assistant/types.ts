import type { UserRole } from '@voiceflow/internal';
import type * as Realtime from '@voiceflow/realtime-sdk';

export interface Member extends Realtime.WorkspaceMember {
  role: UserRole.EDITOR | UserRole.VIEWER;
}
