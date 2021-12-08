import { BlockType } from '@realtime-sdk/constants';

import customPayloadAdapters, { customPayloadOutPortsAdapter } from './customPayload';

export const dialogflowAdapter = {
  [BlockType.PAYLOAD]: customPayloadAdapters,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: customPayloadAdapters,
};

export const dialogflowOutPortAdapter = {
  [BlockType.PAYLOAD]: customPayloadOutPortsAdapter,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: customPayloadOutPortsAdapter,
};
