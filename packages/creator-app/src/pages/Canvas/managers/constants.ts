import { Utils } from '@voiceflow/common';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';

import AccountLinkingManager from './AccountLinking';
import ActionManager from './Action';
import ButtonsManager from './Buttons';
import CancelPaymentManager from './CancelPayment';
import CaptureManager from './Capture';
import CaptureManagerV2 from './CaptureV2';
import CardManager from './Card';
import CardManagerV2 from './CardV2';
import ChoiceManager from './Choice';
import CodeManager from './Code';
import CombinedManager from './Combined';
import CommandManager from './Command';
import ComponentManager from './Component';
import CustomPayloadManager from './CustomPayload';
import DeprecatedManager from './Deprecated';
import DirectiveManager from './Directive';
import DisplayManager from './Display';
import EventManager from './Event';
import ExitManager from './Exit';
import FlowManager from './Flow';
import IfManagerV2 from './IfV2';
import IntegrationManager from './Integration';
import IntentManager from './Intent';
import InvalidPlatformManager from './InvalidPlatform';
import MarkupImageManager from './MarkupImage';
import MarkupTextManager from './MarkupText';
import PaymentManager from './Payment';
import PermissionManager from './Permission';
import PromptManager from './Prompt';
import RandomManager from './Random';
import ReminderManager from './Reminder';
import SetManagerV2 from './SetV2';
import SpeakManager from './Speak';
import StartManager from './Start';
import StreamManager from './Stream';
import TextManager from './Text';
import UserInfoManager from './UserInfo';
import VisualManager from './Visual';

export const MANAGERS_BY_TYPE = {
  [BlockType.START]: StartManager,
  [BlockType.SPEAK]: SpeakManager,
  [BlockType.TEXT]: TextManager,
  [BlockType.CHOICE]: ChoiceManager,
  [BlockType.BUTTONS]: ButtonsManager,
  [BlockType.COMBINED]: CombinedManager,
  [BlockType.COMMAND]: CommandManager,
  [BlockType.PAYLOAD]: CustomPayloadManager,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: CustomPayloadManager,
  [BlockType.SET]: SetManagerV2,
  [BlockType.SETV2]: SetManagerV2,
  [BlockType.IF]: IfManagerV2,
  [BlockType.IFV2]: IfManagerV2,
  [BlockType.CAPTURE]: CaptureManager,
  [BlockType.CAPTUREV2]: CaptureManagerV2,
  [BlockType.RANDOM]: RandomManager,
  [BlockType.INTENT]: IntentManager,
  [BlockType.STREAM]: StreamManager,
  [BlockType.INTEGRATION]: IntegrationManager,
  [BlockType.FLOW]: FlowManager,
  [BlockType.COMPONENT]: ComponentManager,
  [BlockType.CODE]: CodeManager,
  [BlockType.EXIT]: ExitManager,
  [BlockType.CARD]: CardManager,
  [BlockType.CARDV2]: CardManagerV2,
  [BlockType.DISPLAY]: DisplayManager,
  [BlockType.PERMISSION]: PermissionManager,
  [BlockType.ACCOUNT_LINKING]: AccountLinkingManager,
  [BlockType.USER_INFO]: UserInfoManager,
  [BlockType.PAYMENT]: PaymentManager,
  [BlockType.CANCEL_PAYMENT]: CancelPaymentManager,
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
};

const MANAGERS_BY_FEATURE: Partial<Record<BlockType, FeatureFlag>> = {
  [BlockType.INTEGRATION]: FeatureFlag.INTEGRATION_STEP_CLEANUP,
  [BlockType.CODE]: FeatureFlag.CODE_STEP_CLEANUP,
  [BlockType.SPEAK]: FeatureFlag.SPEAK_STEP_CLEANUP,
  [BlockType.TEXT]: FeatureFlag.TEXT_STEP_CLEANUP,
  [BlockType.SETV2]: FeatureFlag.SET_STEP_CLEANUP,
  [BlockType.SET]: FeatureFlag.SET_STEP_CLEANUP,
};

export type ManagersMap = typeof MANAGERS_BY_TYPE;

export const getManager = <T extends BlockType>(
  type: T,
  isV2Enabled?: boolean | null
): T extends keyof ManagersMap ? ManagersMap[T] : ManagersMap[BlockType.DEPRECATED] => {
  const manager = ((Utils.object.hasProperty(MANAGERS_BY_TYPE, type) && MANAGERS_BY_TYPE[type]) ||
    MANAGERS_BY_TYPE[BlockType.DEPRECATED]) as T extends keyof ManagersMap ? ManagersMap[T] : ManagersMap[BlockType.DEPRECATED];

  if (isV2Enabled && manager?.v2) {
    return {
      ...manager,
      ...manager.v2,
    };
  }

  return manager;
};

export const useManager = () => {
  const featureFlags = useSelector(Feature.allActiveFeaturesSelector);
  return <T extends BlockType>(nodeType: T) =>
    getManager(nodeType, MANAGERS_BY_FEATURE[nodeType] && featureFlags[MANAGERS_BY_FEATURE[nodeType] as string]?.isEnabled);
};

export const MANAGERS = Object.values(MANAGERS_BY_TYPE);
