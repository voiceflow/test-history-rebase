import { Version, VersionOptions } from '../version';
import { User } from './user';

export class V1Alpha1 extends Version {
  public user: User;

  constructor(options: VersionOptions) {
    super({ ...options, version: 'v1alpha1' });

    this.user = new User({ axios: this.axios });
  }
}
