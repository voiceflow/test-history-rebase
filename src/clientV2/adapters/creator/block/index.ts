/* eslint-disable camelcase */

import { NodeType } from '@voiceflow/alexa-types';
import { DiagramNode } from '@voiceflow/api-sdk';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType, IntegrationType } from '@/constants';
import { NodeData } from '@/models';

import accountLinkingAdapter from './accountLinking';
import blockDataAdapter from './block';
import captureAdapter from './capture';
import cardAdapter from './card';
import codeAdapter from './code';
import directiveAdapter from './directive';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter from './if';
import integrationAdapter from './integration';
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

export const APP_BLOCK_TYPE_FROM_DB: Record<string, BlockType | ((data: DiagramNode['data']) => BlockType)> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
  [NodeType.API]: BlockType.INTEGRATION,
  [NodeType.ZAPIER]: BlockType.INTEGRATION,
  [NodeType.GOOGLE_SHEETS]: BlockType.INTEGRATION,
};

export const DB_BLOCK_TYPE_FROM_APP: Partial<Record<BlockType, string | ((data: NodeData<any>) => string)>> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [value]: key }), {}),
  [BlockType.INTEGRATION]: (data: NodeData.Integration) => {
    switch (data.selectedIntegration) {
      case IntegrationType.ZAPIER:
        return NodeType.ZAPIER;
      case IntegrationType.GOOGLE_SHEETS:
        return NodeType.GOOGLE_SHEETS;
      default:
        return NodeType.API;
    }
  },
};

const blockAdapter = {
  // internal
  [BlockType.START]: blockDataAdapter,
  [BlockType.COMMAND]: emptyAdapter,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.COMMENT]: emptyAdapter,
  // user defined
  [BlockType.CANCEL_PAYMENT]: emptyAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CARD]: cardAdapter,
  [BlockType.CHOICE_OLD]: emptyAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.DISPLAY]: emptyAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.IF]: ifAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PAYMENT]: emptyAdapter,
  [BlockType.PERMISSION]: emptyAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.REMINDER]: emptyAdapter,
  [BlockType.SET]: setAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: emptyAdapter,
  [BlockType.USER_INFO]: emptyAdapter,
  [BlockType.DEPRECATED]: emptyAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.EVENT]: emptyAdapter,
  [BlockType.PROMPT]: promptAdapter,
  // markup
  [BlockType.MARKUP_TEXT]: emptyAdapter,
  [BlockType.MARKUP_IMAGE]: emptyAdapter,
};

export default blockAdapter;
