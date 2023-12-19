import { SchemaVersion } from './schema-version.enum';

export const SUPPORTED_SCHEMA_VERSIONS: SchemaVersion[] = Object.values(SchemaVersion).sort((l, r) => l - r);

export const LATEST_SCHEMA_VERSION: SchemaVersion = SUPPORTED_SCHEMA_VERSIONS[SUPPORTED_SCHEMA_VERSIONS.length - 1];

export const V2_CMS_SCHEME_VERSION = SchemaVersion.V5_00;
