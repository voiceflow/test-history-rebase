import { CREATOR_KEY } from '@realtime-sdk/constants';
import { EntityMap } from '@realtime-sdk/models';
import { BaseDiagramPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

export const creatorType = Utils.protocol.typeFactory(CREATOR_KEY);

export type SnapshotPayload = BaseDiagramPayload & EntityMap;

export const initialize = Utils.protocol.createAction<SnapshotPayload>(creatorType('INITIALIZE'));

export const importSnapshot = Utils.protocol.createAction<SnapshotPayload>(creatorType('IMPORT_SNAPSHOT'));

export const reset = Utils.protocol.createAction(creatorType('RESET'));
