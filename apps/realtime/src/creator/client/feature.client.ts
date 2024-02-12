import * as Realtime from '@voiceflow/realtime-sdk/backend';
import queryString from 'query-string';

import type { FetchClient } from '../../common/fetch';

export class FeatureClient {
  static BASE_URL = 'features';

  constructor(private readonly client: FetchClient) {}

  public async getStatuses(context: { workspaceID?: string; organizationID?: string } = {}) {
    const url = queryString.stringifyUrl({ url: 'features/status', query: context }, { skipEmptyString: true });
    return this.client.get(url).json<Realtime.feature.FeatureFlagMap>();
  }
}
