import { Utils } from '@voiceflow/common';

import type { SchemaVersion } from '@/schema-version/schema-version.enum';
import type { RealtimeError } from '@/types';

import { versionType } from './utils';

const versionSchemaType = Utils.protocol.typeFactory(versionType('schema'));

export interface NegotiatePayload {
  versionID: string;
  proposedSchemaVersion: SchemaVersion;
}

export interface NegotiateResultPayload {
  projectID: string;
  workspaceID: string;
  schemaVersion: SchemaVersion;
}

export interface MigratePayload {
  versionID: string;
}

export const negotiate = Utils.protocol.createAsyncAction<NegotiatePayload, NegotiateResultPayload>(
  versionSchemaType('NEGOTIATE')
);

export const migrate = Utils.protocol.createAsyncAction<MigratePayload, NegotiateResultPayload, RealtimeError>(
  versionSchemaType('MIGRATE')
);
