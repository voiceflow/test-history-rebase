import { BlockType } from '@/constants';

import buttonsAdapter from './buttons';
import captureAdapter from './capture';
import captureV2Adapter from './captureV2';
import cardV2Adapter from './cardV2';
import carouselAdapter from './carousel';
import interactionAdapter from './interaction';
import promptAdapter from './prompt';

export const chatBlockAdapter = {
  // user defined
  [BlockType.CHOICE]: interactionAdapter,
  [BlockType.PROMPT]: promptAdapter,
  [BlockType.BUTTONS]: buttonsAdapter,
  [BlockType.CAPTURE]: captureAdapter,
  [BlockType.CAPTUREV2]: captureV2Adapter,
  [BlockType.CAROUSEL]: carouselAdapter,
  [BlockType.CARDV2]: cardV2Adapter,
};
