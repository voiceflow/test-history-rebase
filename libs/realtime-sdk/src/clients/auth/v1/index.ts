import type { NestVersionOptions } from '../../nest';
import { NestVersion } from '../../nest';
import { SSO } from './sso';

export class V1 extends NestVersion {
  public sso: SSO;

  constructor(options: NestVersionOptions) {
    super({ ...options, version: 'v1' });

    this.sso = new SSO({ axios: this.axios });
  }
}
