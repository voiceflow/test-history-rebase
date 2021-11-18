import { BlockType } from '@realtime-sdk/constants';

import customPayloadAdapters, { customPayloadOutPortsAdapter } from './customPayload';

export const dialogflowAdapter = {
  [BlockType.CUSTOM_PAYLOAD]: customPayloadAdapters,
};

export const dialogflowOutPortAdapter = {
  [BlockType.CUSTOM_PAYLOAD]: customPayloadOutPortsAdapter,
};
