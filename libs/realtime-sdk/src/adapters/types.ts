import { SchemaVersion } from '@realtime-sdk/schema-version/schema-version.enum';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdapterContext {}

export interface VersionAdapterContext extends AdapterContext {
  schemaVersion: SchemaVersion;
}
