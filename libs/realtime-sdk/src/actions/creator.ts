import { Utils } from '@voiceflow/common';

import { CREATOR_KEY } from '@/constants';
import type { EntityMap } from '@/models';
import type { BaseDiagramPayload, ProjectMetaPayload, SchemaVersionPayload } from '@/types';

export const creatorType = Utils.protocol.typeFactory(CREATOR_KEY);

export interface SnapshotPayload extends BaseDiagramPayload, EntityMap {}

export interface ImportSnapshotPayload extends SnapshotPayload, ProjectMetaPayload, SchemaVersionPayload {}

export const initialize = Utils.protocol.createAction<SnapshotPayload>(creatorType('INITIALIZE'));

export const importSnapshot = Utils.protocol.createAction<ImportSnapshotPayload>(creatorType('IMPORT_SNAPSHOT'));

export const reset = Utils.protocol.createAction(creatorType('RESET'));
export const resetActive = Utils.protocol.createAction(creatorType('RESET_ACTIVE'));
