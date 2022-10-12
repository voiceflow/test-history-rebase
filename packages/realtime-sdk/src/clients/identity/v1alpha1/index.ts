import { Version, VersionOptions } from '../version';
import { User } from './user';
import { Workspace } from './workspace';
import { WorkspaceInvitation } from './workspaceInvitation';
import { WorkspaceMember } from './workspaceMember';

export class V1Alpha1 extends Version {
  public user: User;

  public workspace: Workspace;

  public workspaceMember: WorkspaceMember;

  public workspaceInvitation: WorkspaceInvitation;

  constructor(options: VersionOptions) {
    super({ ...options, version: 'v1alpha1' });

    const resourceOptions = { axios: this.axios };

    this.user = new User(resourceOptions);
    this.workspace = new Workspace(resourceOptions);
    this.workspaceMember = new WorkspaceMember(resourceOptions);
    this.workspaceInvitation = new WorkspaceInvitation(resourceOptions);
  }
}
