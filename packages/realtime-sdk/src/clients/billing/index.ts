import { NestVersion, NestVersionOptions } from '../nest';
import { Quota } from './quota';

export class Api extends NestVersion {
  public quota: Quota;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1' });

    const resourceOptions = { axios: this.axios };

    this.quota = new Quota(resourceOptions);
  }
}
