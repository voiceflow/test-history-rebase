/* eslint-disable camelcase */

import { NodeType } from '@voiceflow/alexa-types';
import { DiagramNode } from '@voiceflow/api-sdk';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType, IntegrationType } from '@/constants';
import { NodeData } from '@/models';

import { generateOutPort } from '../utils';
import accountLinkingAdapter from './accountLinking';
import blockDataAdapter from './block';
import cancelPayment from './cancelPayment';
import captureAdapter from './capture';
import cardAdapter from './card';
import codeAdapter from './code';
import commandAdapter from './command';
import directiveAdapter from './directive';
import displayAdapter from './display';
import eventAdapter from './event';
import exitAdapter from './exit';
import flowAdapter from './flow';
import ifAdapter from './if';
import integrationAdapter from './integration';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import paymentAdapter from './payment';
import permissionAdapter from './permission';
import promptAdapter from './prompt';
import randomAdapter from './random';
import reminderAdapter from './reminder';
import setAdapter from './set';
import speakAdapter from './speak';
import streamAdapter, { streamPortsAdapter } from './stream';
import userInfoAdapter from './userInfo';
import { PortsAdapter } from './utils';

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
  [BlockType.COMMAND]: commandAdapter,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.COMMENT]: emptyAdapter,
  // user defined
  [BlockType.CANCEL_PAYMENT]: cancelPayment,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CARD]: cardAdapter,
  [BlockType.CHOICE_OLD]: emptyAdapter,
  [BlockType.CODE]: codeAdapter,
  [BlockType.DISPLAY]: displayAdapter,
  [BlockType.EXIT]: exitAdapter,
  [BlockType.FLOW]: flowAdapter,
  [BlockType.IF]: ifAdapter,
  [BlockType.INTEGRATION]: integrationAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PAYMENT]: paymentAdapter,
  [BlockType.PERMISSION]: permissionAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingAdapter,
  [BlockType.RANDOM]: randomAdapter,
  [BlockType.REMINDER]: reminderAdapter,
  [BlockType.SET]: setAdapter,
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.STREAM]: streamAdapter,
  [BlockType.USER_INFO]: userInfoAdapter,
  [BlockType.DEPRECATED]: emptyAdapter,
  [BlockType.DIRECTIVE]: directiveAdapter,
  [BlockType.EVENT]: eventAdapter,
  [BlockType.PROMPT]: promptAdapter,
  // markup
  [BlockType.MARKUP_TEXT]: emptyAdapter,
  [BlockType.MARKUP_IMAGE]: emptyAdapter,
};

export const portsAdapter: Record<string, PortsAdapter> = {
  [BlockType.STREAM]: streamPortsAdapter,
};

export const defaultPortAdapter: PortsAdapter = {
  toDB: (ports) => ports.map(({ port, target }) => ({ type: port.label || '', target })),
  fromDB: (ports, node) =>
    ports.map((port, index) => ({
      port: generateOutPort(node.nodeID, index, { label: port.type }),
      target: port.target,
    })),
};

export default blockAdapter;
