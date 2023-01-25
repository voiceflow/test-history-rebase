import { NestVersion, NestVersionOptions } from '../../nest';
import { ApiKey } from './api-key';
import { Organization } from './organization';
import { ProjectMember } from './projectMember';
import { Provider } from './provider';
import { User } from './user';
import { Workspace } from './workspace';
import { WorkspaceInvitation } from './workspaceInvitation';
import { WorkspaceMember } from './workspaceMember';
import { WorkspaceProperty } from './workspaceProperties';

export class V1Alpha1 extends NestVersion {
  public user: User;

  public apiKey: ApiKey;

  public provider: Provider;

  public workspace: Workspace;

  public organization: Organization;

  public projectMember: ProjectMember;

  public workspaceMember: WorkspaceMember;

  public workspaceProperty: WorkspaceProperty;

  public workspaceInvitation: WorkspaceInvitation;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1alpha1' });

    const resourceOptions = { axios: this.axios };

    this.user = new User(resourceOptions);
    this.apiKey = new ApiKey(resourceOptions);
    this.provider = new Provider(resourceOptions);
    this.workspace = new Workspace(resourceOptions);
    this.organization = new Organization(resourceOptions);
    this.projectMember = new ProjectMember(resourceOptions);
    this.workspaceMember = new WorkspaceMember(resourceOptions);
    this.workspaceProperty = new WorkspaceProperty(resourceOptions);
    this.workspaceInvitation = new WorkspaceInvitation(resourceOptions);
  }
}
