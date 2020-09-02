/* eslint-disable camelcase */

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType } from '@/constants';

import blockDataAdapter from './block';
import captureAdapter from './capture';
import codeAdapter from './code';
import flowAdapter from './flow';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';
import randomAdapter from './random';
import setAdapter from './set';
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
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CARD]: emptyAdapter,
  [BlockType.CHOICE_OLD]: emptyAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.DISPLAY]: emptyAdapter,
  [BlockType.EXIT]: emptyAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.IF]: emptyAdapter,
  [BlockType.INTEGRATION]: emptyAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PAYMENT]: emptyAdapter,
  [BlockType.PERMISSION]: emptyAdapter,
  [BlockType.ACCOUNT_LINKING]: emptyAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.REMINDER]: emptyAdapter,
  [BlockType.SET]: setAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: emptyAdapter,
  [BlockType.USER_INFO]: emptyAdapter,
  [BlockType.DEPRECATED]: emptyAdapter,
  [BlockType.DIRECTIVE]: emptyAdapter,
  [BlockType.EVENT]: emptyAdapter,
  [BlockType.PROMPT]: promptAdapter,
  // markup
  [BlockType.MARKUP_TEXT]: emptyAdapter,
  [BlockType.MARKUP_IMAGE]: emptyAdapter,
};

export default blockAdapter;
