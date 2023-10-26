import { FetchClient } from './types';

export class VersionClient {
  static BASE_URL = '/v2/versions';

  constructor(private readonly client: FetchClient) {}

  // TODO: remove with new backup system
  public async snapshot(versionID: string, options: { manualSave?: boolean; name?: string; autoSaveFromRestore?: boolean } = {}) {
    const query = new URLSearchParams();

    if (options.name) query.set('saveVersionName', options.name);
    if (options.manualSave) query.set('manualSave', 'true');
    if (options.autoSaveFromRestore) query.set('autoSaveFromRestore', 'true');

    await this.client.get(`${VersionClient.BASE_URL}/snapshot/${versionID}?${query.toString()}`);
  }
}
