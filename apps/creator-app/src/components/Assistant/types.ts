import { ProjectUserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

export interface Member extends Realtime.WorkspaceMember {
  role: ProjectUserRole;
}
