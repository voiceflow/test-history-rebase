/* eslint-disable camelcase */

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType } from '@/constants';

import blockDataAdapter from './block';
import interactionAdapter from './interaction';
import speakAdapter from './speak';

const emptyAdapter = createSimpleAdapter(
  () => ({}),
  () => ({})
);

const BLOCK_TYPE_MAPPING: [string, BlockType][] = [['block', BlockType.COMBINED]];

export const APP_BLOCK_TYPE_FROM_DB = BLOCK_TYPE_MAPPING.reduce<Record<string, BlockType>>((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});

export const DB_BLOCK_TYPE_FROM_APP = BLOCK_TYPE_MAPPING.reduce<Partial<Record<BlockType, string>>>((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const blockAdapter = {
  // internal
  [BlockType.START]: blockDataAdapter,
  [BlockType.COMMAND]: emptyAdapter,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.COMMENT]: emptyAdapter,
  // user defined
  [BlockType.CANCEL_PAYMENT]: emptyAdapter,
  [BlockType.CAPTURE]: emptyAdapter,
  [BlockType.CARD]: emptyAdapter,
  [BlockType.CHOICE_OLD]: emptyAdapter,
  [BlockType.CODE]: emptyAdapter,
  [BlockType.DISPLAY]: emptyAdapter,
  [BlockType.EXIT]: emptyAdapter,
  [BlockType.FLOW]: emptyAdapter,
  [BlockType.IF]: emptyAdapter,
  [BlockType.INTEGRATION]: emptyAdapter,
  [BlockType.INTENT]: emptyAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PAYMENT]: emptyAdapter,
  [BlockType.PERMISSION]: emptyAdapter,
  [BlockType.ACCOUNT_LINKING]: emptyAdapter,
  [BlockType.RANDOM]: emptyAdapter,
  [BlockType.REMINDER]: emptyAdapter,
  [BlockType.SET]: emptyAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: emptyAdapter,
  [BlockType.USER_INFO]: emptyAdapter,
  [BlockType.DEPRECATED]: emptyAdapter,
  [BlockType.DIRECTIVE]: emptyAdapter,
  [BlockType.EVENT]: emptyAdapter,
  [BlockType.PROMPT]: emptyAdapter,
  // markup
  [BlockType.MARKUP_TEXT]: emptyAdapter,
  [BlockType.MARKUP_IMAGE]: emptyAdapter,
  [BlockType.MARKUP_SHAPE]: emptyAdapter,
};

export default blockAdapter;
