import { ExtraOptions } from './types';

export interface FeatureClient {
  isEnabled: (feature: string, workspaceID: string) => Promise<boolean>;
}

const Client = ({ api }: ExtraOptions): FeatureClient => ({
  isEnabled: (feature: string, workspaceID: string) => api.get(`/feature/${feature}?workspaceID=${workspaceID}`),
});

export default Client;
