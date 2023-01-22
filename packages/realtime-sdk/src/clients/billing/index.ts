import { NestVersion, NestVersionOptions } from '../nest';
import { PrivateQuota } from './private-quota';
import { Quota } from './quota';

export class Api extends NestVersion {
  public quota: Quota;

  public privateQuota: PrivateQuota;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1' });

    const resourceOptions = { axios: this.axios };

    this.quota = new Quota(resourceOptions);
    this.privateQuota = new PrivateQuota(resourceOptions);
  }
}
