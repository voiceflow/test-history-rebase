import { BlockType } from '../../../../constants';
import customPayloadAdapters from './customPayload';

// eslint-disable-next-line import/prefer-default-export
export const dialogflowAdapter = {
  [BlockType.CUSTOM_PAYLOAD]: customPayloadAdapters,
};
