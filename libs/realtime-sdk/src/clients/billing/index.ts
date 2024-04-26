import type { NestVersionOptions } from '../nest';
import { NestVersion } from '../nest';
import { PrivateQuota } from './private-quota';
import { PrivateWorkspace } from './private-workspace';
import { Quota } from './quota';
import { Workspace } from './workspace';

export class Api extends NestVersion {
  public quota: Quota;

  public workspace: Workspace;

  public privateQuota: PrivateQuota;

  public privateWorkspace: PrivateWorkspace;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1' });

    const resourceOptions = { axios: this.axios };

    this.quota = new Quota(resourceOptions);
    this.privateQuota = new PrivateQuota(resourceOptions);
    this.privateWorkspace = new PrivateWorkspace(resourceOptions);
    this.workspace = new Workspace(resourceOptions);
  }
}
