import { CUSTOM_BLOCK_KEY } from '@realtime-sdk/constants';
import type { CustomBlock } from '@realtime-sdk/models';
import type { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const customBlockType = Utils.protocol.typeFactory(CUSTOM_BLOCK_KEY);

export const crud = createCRUDActions<CustomBlock, BaseVersionPayload>(customBlockType);
