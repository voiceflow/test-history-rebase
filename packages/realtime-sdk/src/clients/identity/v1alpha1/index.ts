import { NestVersion, NestVersionOptions } from '../../nest';
import { ApiKey } from './api-key';
import { Organization } from './organization';
import { Provider } from './provider';
import { User } from './user';
import { Workspace } from './workspace';
import { WorkspaceInvitation } from './workspaceInvitation';
import { WorkspaceMember } from './workspaceMember';
import { WorkspaceProperty } from './workspaceProperties';

export class V1Alpha1 extends NestVersion {
  public apiKey: ApiKey;

  public user: User;

  public workspace: Workspace;

  public workspaceMember: WorkspaceMember;

  public workspaceInvitation: WorkspaceInvitation;

  public workspaceProperty: WorkspaceProperty;

  public provider: Provider;

  public organization: Organization;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1alpha1' });

    const resourceOptions = { axios: this.axios };

    this.apiKey = new ApiKey(resourceOptions);
    this.user = new User(resourceOptions);
    this.workspace = new Workspace(resourceOptions);
    this.workspaceMember = new WorkspaceMember(resourceOptions);
    this.workspaceInvitation = new WorkspaceInvitation(resourceOptions);
    this.provider = new Provider(resourceOptions);
    this.workspaceProperty = new WorkspaceProperty(resourceOptions);
    this.organization = new Organization(resourceOptions);
  }
}
