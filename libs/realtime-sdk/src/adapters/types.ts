import { SchemaVersion } from '@realtime-sdk/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdapterContext {}

export interface VersionAdapterContext extends AdapterContext {
  schemaVersion: SchemaVersion;
}
