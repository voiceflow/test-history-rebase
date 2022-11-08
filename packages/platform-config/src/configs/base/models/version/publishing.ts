import { BaseVersion } from '@voiceflow/base-types';

export interface Model extends BaseVersion.Publishing {
  invocationName: string;
  invocationNameSamples: string[];
}
