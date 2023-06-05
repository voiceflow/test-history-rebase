import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import ActionManager from './Action';
import AIResponseManager from './AIResponse';
import AISetManager from './AISet';
import ButtonsManager from './Buttons';
import CaptureManager from './Capture';
import CaptureManagerV2 from './CaptureV2';
import CardV2Manager from './CardV2';
import CarouselManager from './Carousel';
import ChoiceManager from './Choice';
import CodeManager from './Code';
import CombinedManager from './Combined';
import ComponentManager from './Component';
import CustomPayloadManager from './CustomPayload';
import DeprecatedManager from './Deprecated';
import ExitManager from './Exit';
import GoToDomainManager from './GoToDomain';
import GoToIntentManager from './GoToIntent';
import GoToNodeManager from './GoToNode';
import IfManagerV2 from './IfV2';
import IntegrationManager from './Integration';
import IntentManager from './Intent';
import InvalidPlatformManager from './InvalidPlatform';
import MarkupImageManager from './MarkupImage';
import MarkupTextManager from './MarkupText';
import MarkupVideoManager from './MarkupVideo';
import PromptManager from './Prompt';
import RandomManagerV2 from './RandomV2';
import SetManagerV2 from './SetV2';
import SpeakManager from './Speak';
import StartManager from './Start';
import TextManager from './Text';
import UrlManager from './Url';
import VisualManager from './Visual';

export const MANAGERS_BY_TYPE = {
  [BlockType.START]: StartManager,
  [BlockType.SPEAK]: SpeakManager,
  [BlockType.TEXT]: TextManager,
  [BlockType.CHOICE]: ChoiceManager,
  [BlockType.BUTTONS]: ButtonsManager,
  [BlockType.COMBINED]: CombinedManager,
  [BlockType.COMMAND]: DeprecatedManager,
  [BlockType.PAYLOAD]: CustomPayloadManager,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: CustomPayloadManager,
  [BlockType.SET]: SetManagerV2,
  [BlockType.SETV2]: SetManagerV2,
  [BlockType.IF]: IfManagerV2,
  [BlockType.IFV2]: IfManagerV2,
  [BlockType.CAPTURE]: CaptureManager,
  [BlockType.CAPTUREV2]: CaptureManagerV2,
  [BlockType.RANDOMV2]: RandomManagerV2,
  [BlockType.INTENT]: IntentManager,
  [BlockType.INTEGRATION]: IntegrationManager,
  [BlockType.COMPONENT]: ComponentManager,
  [BlockType.CODE]: CodeManager,
  [BlockType.EXIT]: ExitManager,
  [BlockType.CAROUSEL]: CarouselManager,
  [BlockType.CARDV2]: CardV2Manager,
  [BlockType.AI_SET]: AISetManager,
  [BlockType.AI_RESPONSE]: AIResponseManager,
  [BlockType.TRACE]: ActionManager,
  [BlockType.PROMPT]: PromptManager,
  [BlockType.DEPRECATED]: DeprecatedManager,
  [BlockType.INVALID_PLATFORM]: InvalidPlatformManager,
  [BlockType.VISUAL]: VisualManager,
  [BlockType.MARKUP_TEXT]: MarkupTextManager,
  [BlockType.MARKUP_IMAGE]: MarkupImageManager,
  [BlockType.MARKUP_VIDEO]: MarkupVideoManager,
  [BlockType.URL]: UrlManager,
  [BlockType.GO_TO_INTENT]: GoToIntentManager,
  [BlockType.GO_TO_NODE]: GoToNodeManager,
  [BlockType.GO_TO_DOMAIN]: GoToDomainManager,
};

export const MANAGERS_BY_FEATURE: Partial<Record<BlockType, Realtime.FeatureFlag>> = {};

export type ManagersMap = typeof MANAGERS_BY_TYPE;

export const MANAGERS = Object.values(MANAGERS_BY_TYPE);
