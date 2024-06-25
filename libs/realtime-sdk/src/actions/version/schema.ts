import type { SchemaVersion } from '@realtime-sdk/schema-version/schema-version.enum';
import type { RealtimeError } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

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
