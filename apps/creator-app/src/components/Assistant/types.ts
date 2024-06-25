import type { ProjectUserRole } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';

export interface Member extends Realtime.WorkspaceMember {
  role: ProjectUserRole;
}
