import { Utils } from '@voiceflow/common';

import { CUSTOM_BLOCK_KEY } from '@/constants';
import type { CustomBlock } from '@/models';
import type { BaseVersionPayload } from '@/types';

import { createCRUDActions } from './utils';

const customBlockType = Utils.protocol.typeFactory(CUSTOM_BLOCK_KEY);

export const crud = createCRUDActions<CustomBlock, BaseVersionPayload>(customBlockType);
