import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import AccountLinkingManager from './AccountLinking';
import ActionManager from './Action';
import AIResponseManager from './AIResponse';
import AISetManager from './AISet';
import ButtonsManager from './Buttons';
import { ButtonsV2Manager } from './ButtonsV2Manager/ButtonsV2.manager';
import CaptureManager from './Capture';
import CaptureManagerV2 from './CaptureV2';
import CardManager from './Card';
import CardV2Manager from './CardV2';
import CarouselManager from './Carousel';
import ChoiceManager from './Choice';
import CodeManager from './Code';
import CombinedManager from './Combined';
import { ComponentManager } from './Component/Component.manager';
import CustomBlockPointerManager from './CustomBlockPointer';
import CustomPayloadManager from './CustomPayload';
import DeprecatedManager from './Deprecated';
import DirectiveManager from './Directive';
import DisplayManager from './Display';
import EventManager from './Event';
import ExitManager from './Exit';
import FunctionManager from './FunctionManager/Function.manager';
import GoToIntentManager from './GoToIntent';
import GoToNodeManager from './GoToNode';
import IfManagerV2 from './IfV2';
import IntegrationManager from './Integration';
import IntentManager from './Intent';
import InvalidPlatformManager from './InvalidPlatform';
import MarkupImageManager from './MarkupImage';
import MarkupTextManager from './MarkupText';
import MarkupVideoManager from './MarkupVideo';
import MessageManager from './MessageManager/Message.manager';
import PermissionManager from './Permission';
import PromptManager from './Prompt';
import RandomManagerV2 from './RandomV2';
import ReminderManager from './Reminder';
import { SetV2Manager } from './SetV2Manager/SetV2.manager';
import SpeakManager from './Speak';
import { StartManager } from './Start/Start.manager';
import StreamManager from './Stream';
import TextManager from './Text';
import { TriggerManager } from './TriggerManager/Trigger.manager';
import UrlManager from './Url';
import UserInfoManager from './UserInfo';
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
  [BlockType.SET]: SetV2Manager,
  [BlockType.SETV2]: SetV2Manager,
  [BlockType.IF]: IfManagerV2,
  [BlockType.IFV2]: IfManagerV2,
  [BlockType.CAPTURE]: CaptureManager,
  [BlockType.CAPTUREV2]: CaptureManagerV2,
  [BlockType.RANDOMV2]: RandomManagerV2,
  [BlockType.INTENT]: IntentManager,
  [BlockType.STREAM]: StreamManager,
  [BlockType.INTEGRATION]: IntegrationManager,
  [BlockType.COMPONENT]: ComponentManager,
  [BlockType.CODE]: CodeManager,
  [BlockType.EXIT]: ExitManager,
  [BlockType.CARD]: CardManager,
  [BlockType.CAROUSEL]: CarouselManager,
  [BlockType.CARDV2]: CardV2Manager,
  [BlockType.AI_SET]: AISetManager,
  [BlockType.AI_RESPONSE]: AIResponseManager,
  [BlockType.DISPLAY]: DisplayManager,
  [BlockType.PERMISSION]: PermissionManager,
  [BlockType.ACCOUNT_LINKING]: AccountLinkingManager,
  [BlockType.USER_INFO]: UserInfoManager,
  [BlockType.REMINDER]: ReminderManager,
  [BlockType.EVENT]: EventManager,
  [BlockType.DIRECTIVE]: DirectiveManager,
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
  [BlockType.CUSTOM_BLOCK_POINTER]: CustomBlockPointerManager,
  [BlockType.FUNCTION]: FunctionManager,
  [BlockType.TRIGGER]: TriggerManager,
  [BlockType.MESSAGE]: MessageManager,
  [BlockType.BUTTONS_V2]: ButtonsV2Manager,
};

export const MANAGERS_BY_FEATURE: Partial<Record<BlockType, Realtime.FeatureFlag>> = {
  [BlockType.SETV2]: Realtime.FeatureFlag.V3_SET_STEP,
};

export type ManagersMap = typeof MANAGERS_BY_TYPE;

export const MANAGERS = Object.values(MANAGERS_BY_TYPE);
