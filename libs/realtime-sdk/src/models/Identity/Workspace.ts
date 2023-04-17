import { WorkspaceMember } from './WorkspaceMember';

export interface Workspace {
  id: string;
  organizationID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  image: string;
  members?: WorkspaceMember[];
}
