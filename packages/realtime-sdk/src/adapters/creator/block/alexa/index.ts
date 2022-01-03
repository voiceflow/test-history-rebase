import { BlockType } from '@realtime-sdk/constants';

import accountLinkingAdapter, { accountLinkingOutPortAdapter } from './accountLinking';
import cancelPaymentAdapter, { cancelPaymentOutPortAdapter } from './cancelPayment';
import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import commandAdapter from './command';
import displayAdapter, { displayOutPortAdapter } from './display';
import eventAdapter, { eventOutPortAdapter } from './event';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import paymentAdapter, { paymentOutPortAdapter } from './payment';
import permissionAdapter, { permissionOutPortAdapter } from './permission';
import promptAdapter from './prompt';
import reminderAdapter, { reminderOutPortAdapter } from './reminder';
import speakAdapter from './speak';
import streamAdapter, { streamOutPortsAdapter } from './stream';
import userInfoAdapter, { userInfoOutPortAdapter } from './userInfo';

export const alexaBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.SPEAK]: speakAdapter,
  [BlockType.EVENT]: eventAdapter,
  [BlockType.STREAM]: streamAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.INTENT]: intentAdapter,
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.DISPLAY]: displayAdapter,
  [BlockType.PAYMENT]: paymentAdapter,
  [BlockType.REMINDER]: reminderAdapter,
  [BlockType.CAPTUREV2]: captureV2Adapter,
  [BlockType.USER_INFO]: userInfoAdapter,
  [BlockType.PERMISSION]: permissionAdapter,
  [BlockType.CANCEL_PAYMENT]: cancelPaymentAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingAdapter,
};

export const alexaOutPortAdapter = {
  [BlockType.EVENT]: eventOutPortAdapter,
  [BlockType.STREAM]: streamOutPortsAdapter,
  [BlockType.DISPLAY]: displayOutPortAdapter,
  [BlockType.PAYMENT]: paymentOutPortAdapter,
  [BlockType.REMINDER]: reminderOutPortAdapter,
  [BlockType.USER_INFO]: userInfoOutPortAdapter,
  [BlockType.PERMISSION]: permissionOutPortAdapter,
  [BlockType.CANCEL_PAYMENT]: cancelPaymentOutPortAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingOutPortAdapter,
};
