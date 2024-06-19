import { WorkspaceAction } from '@/workspace/workspace.types';

export interface WorkspaceMemberAction extends WorkspaceAction {
  // required, so we can broadcast workspace member changes to the organization
  organizationID: string;
}
