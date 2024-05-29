import { ProjectUserRole } from '@voiceflow/dtos';

import { User } from './User';

export interface ProjectMember {
  user: User;
  membership: { role: ProjectUserRole; projectID: string };
}
