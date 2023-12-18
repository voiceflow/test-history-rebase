import { BlockType } from '@realtime-sdk/constants';

import accountLinkingAdapter, { accountLinkingOutPortAdapter, accountLinkingOutPortAdapterV2 } from './accountLinking';
import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import commandAdapter from './command';
import displayAdapter, { displayOutPortAdapter, displayOutPortAdapterV2 } from './display';
import eventAdapter, { eventOutPortAdapter, eventOutPortAdapterV2 } from './event';
import intentAdapter from './intent';
import interactionAdapter from './interaction';
import permissionAdapter, { permissionOutPortAdapter, permissionOutPortAdapterV2 } from './permission';
import promptAdapter from './prompt';
import reminderAdapter, { reminderOutPortAdapter, reminderOutPortAdapterV2 } from './reminder';
import speakAdapter from './speak';
import streamAdapter, { streamOutPortsAdapter, streamOutPortsAdapterV2 } from './stream';
import userInfoAdapter, { userInfoOutPortAdapter, userInfoOutPortAdapterV2 } from './userInfo';

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
  [BlockType.REMINDER]: reminderAdapter,
  [BlockType.CAPTUREV2]: captureV2Adapter,
  [BlockType.USER_INFO]: userInfoAdapter,
  [BlockType.PERMISSION]: permissionAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingAdapter,
};

export const alexaOutPortAdapter = {
  [BlockType.EVENT]: eventOutPortAdapter,
  [BlockType.STREAM]: streamOutPortsAdapter,
  [BlockType.DISPLAY]: displayOutPortAdapter,
  [BlockType.REMINDER]: reminderOutPortAdapter,
  [BlockType.USER_INFO]: userInfoOutPortAdapter,
  [BlockType.PERMISSION]: permissionOutPortAdapter,
  [BlockType.ACCOUNT_LINKING]: accountLinkingOutPortAdapter,
};

export const alexaOutPortAdapterV2 = {
  [BlockType.EVENT]: eventOutPortAdapterV2,
  [BlockType.STREAM]: streamOutPortsAdapterV2,
  [BlockType.DISPLAY]: displayOutPortAdapterV2,
  [BlockType.REMINDER]: reminderOutPortAdapterV2,
  [BlockType.USER_INFO]: userInfoOutPortAdapterV2,
  [BlockType.PERMISSION]: permissionOutPortAdapterV2,
  [BlockType.ACCOUNT_LINKING]: accountLinkingOutPortAdapterV2,
};
