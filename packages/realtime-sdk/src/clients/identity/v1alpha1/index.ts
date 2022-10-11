import { Version, VersionOptions } from '../version';
import { User } from './user';
import { Workspace } from './workspace';
import { WorkspaceInvitation } from './workspaceInvitation';

export class V1Alpha1 extends Version {
  public user: User;

  public workspace: Workspace;

  public workspaceInvitation: WorkspaceInvitation;

  constructor(options: VersionOptions) {
    super({ ...options, version: 'v1alpha1' });

    const resourceOptions = { axios: this.axios };

    this.user = new User(resourceOptions);
    this.workspace = new Workspace(resourceOptions);
    this.workspaceInvitation = new WorkspaceInvitation(resourceOptions);
  }
}
