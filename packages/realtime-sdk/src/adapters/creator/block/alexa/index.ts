import { BlockType } from '@realtime-sdk/constants';

import accountLinkingAdapter from './accountLinking';
import cancelPaymentAdapter from './cancelPayment';
import captureAdapter from './capture';
import cardAdapter from './card';
import commandAdapter from './command';
import displayAdapter from './display';
import eventAdapter from './event';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import paymentAdapter from './payment';
import permissionAdapter from './permission';
import promptAdapter from './prompt';
import reminderAdapter from './reminder';
import speakAdapter from './speak';
import streamAdapter, { streamPortsAdapter } from './stream';
import userInfoAdapter from './userInfo';

export const alexaBlockAdapter = {
  // internal
  [BlockType.COMMAND]: commandAdapter,

  // user defined
  [BlockType.CARD]: cardAdapter,
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
  [BlockType.USER_INFO]: userInfoAdapter,
  [BlockType.PERMISSION]: permissionAdapter,
  [BlockType.CANCEL_PAYMENT]: cancelPaymentAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingAdapter,
};

export const alexaPortsAdapter = {
  [BlockType.STREAM]: streamPortsAdapter,
};
