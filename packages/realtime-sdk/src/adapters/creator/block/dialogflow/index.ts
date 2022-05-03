import { BlockType } from '@realtime-sdk/constants';

import customPayloadAdapters, { customPayloadOutPortsAdapter, customPayloadOutPortsAdapterV2 } from './customPayload';

export const dialogflowAdapter = {
  [BlockType.PAYLOAD]: customPayloadAdapters,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: customPayloadAdapters,
};

export const dialogflowOutPortAdapter = {
  [BlockType.PAYLOAD]: customPayloadOutPortsAdapter,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: customPayloadOutPortsAdapter,
};

export const dialogflowOutPortAdapterV2 = {
  [BlockType.PAYLOAD]: customPayloadOutPortsAdapterV2,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: customPayloadOutPortsAdapterV2,
};
