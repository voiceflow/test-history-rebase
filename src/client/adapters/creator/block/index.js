/* eslint-disable camelcase */

import { BlockType } from '@/constants';

import { createSimpleAdapter, identityAdapter } from '../../utils';
import cancelPaymentBlockAdapter from './cancelPayment';
import captureBlockAdapter from './capture';
import cardBlockAdapter from './card';
import choiceBlockAdapter from './choice';
import codeBlockAdapter from './code';
import commandBlockAdapter from './command';
import deprecatedBlockAdapter from './deprecated';
import displayBlockAdapter from './display';
import exitBlockAdapter from './exit';
import flowBlockAdapter from './flow';
import ifBlockAdapter from './if';
import integrationBlockAdapter from './integration';
import intentBlockAdapter from './intent';
import interactionBlockAdapter from './interaction';
import paymentBlockAdapter from './payment';
import permissionBlockAdapter from './permission';
import randomBlockAdapter from './random';
import reminderBlockAdapter from './reminder';
import setBlockAdapter from './set';
import speakBlockAdapter from './speak';
import streamBlockAdapter from './stream';
import userInfoBlockAdapter from './userInfo';

const BLOCK_TYPE_MAPPING = [
  ['story', BlockType.START],
  ['god', BlockType.COMBINED],
  ['integrations', BlockType.INTEGRATION],
  ['permissions', BlockType.USER_INFO],
  ['cancel', BlockType.CANCEL_PAYMENT],
];
export const APP_BLOCK_TYPE_FROM_DB = BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});
export const DB_BLOCK_TYPE_FROM_APP = BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const blockAdapter = {
  // internal
  [BlockType.START]: identityAdapter,
  [BlockType.COMMAND]: commandBlockAdapter,
  [BlockType.COMBINED]: createSimpleAdapter(() => ({}), () => ({})),
  [BlockType.COMMENT]: createSimpleAdapter(() => ({}), () => ({})),
  // user defined
  [BlockType.CANCEL_PAYMENT]: cancelPaymentBlockAdapter,
  [BlockType.CAPTURE]: captureBlockAdapter,
  [BlockType.CARD]: cardBlockAdapter,
  [BlockType.CHOICE]: choiceBlockAdapter,
  [BlockType.CODE]: codeBlockAdapter,
  [BlockType.DISPLAY]: displayBlockAdapter,
  [BlockType.EXIT]: exitBlockAdapter,
  [BlockType.FLOW]: flowBlockAdapter,
  [BlockType.IF]: ifBlockAdapter,
  [BlockType.INTEGRATION]: integrationBlockAdapter,
  [BlockType.INTENT]: intentBlockAdapter,
  [BlockType.INTERACTION]: interactionBlockAdapter,
  [BlockType.PAYMENT]: paymentBlockAdapter,
  [BlockType.PERMISSION]: permissionBlockAdapter,
  [BlockType.RANDOM]: randomBlockAdapter,
  [BlockType.REMINDER]: reminderBlockAdapter,
  [BlockType.SET]: setBlockAdapter,
  [BlockType.SPEAK]: speakBlockAdapter,
  [BlockType.STREAM]: streamBlockAdapter,
  [BlockType.USER_INFO]: userInfoBlockAdapter,
  [BlockType.DEPRECATED]: deprecatedBlockAdapter,
};

export default blockAdapter;
