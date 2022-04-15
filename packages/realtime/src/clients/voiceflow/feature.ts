import * as Realtime from '@voiceflow/realtime-sdk';
import queryString from 'query-string';

import { ExtraOptions } from './types';

export interface FeatureClient {
  isEnabled: (feature: Realtime.FeatureFlag, workspaceID?: string, organizationID?: string) => Promise<boolean>;
}

const Client = ({ api }: ExtraOptions): FeatureClient => ({
  isEnabled: (feature, workspaceID, organizationID) =>
    api
      .get<{ status: boolean }>(`/feature/${feature}?${queryString.stringify({ workspaceID, organizationID }, { skipEmptyString: true })}`)
      .then((res) => res.data.status),
});

export default Client;
