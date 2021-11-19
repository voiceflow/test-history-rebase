import { ExtraOptions } from './types';

export interface FeatureClient {
  isEnabled: (feature: string, workspaceID?: string) => Promise<boolean>;
}

const Client = ({ api }: ExtraOptions): FeatureClient => ({
  isEnabled: (feature, workspaceID) =>
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    api.get<{ status: boolean }>(`/feature/${feature}${workspaceID ? `?workspaceID=${workspaceID}` : ''}`).then((res) => res.data.status),
});

export default Client;
