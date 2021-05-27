import { BlockType } from '@/constants';

import AccountLinkingManager from './AccountLinking';
import ActionManager from './Action';
import CancelPaymentManager from './CancelPayment';
import CaptureManager from './Capture';
import CardManager from './Card';
import ChoiceManager from './Choice';
import ChoiceOldManager from './ChoiceOld';
import CodeManager from './Code';
import CombinedManager from './Combined';
import CommandManager from './Command';
import CommentManager from './Comment';
import DeprecatedManager from './Deprecated';
import DirectiveManager from './Directive';
import DisplayManager from './Display';
import EventManager from './Event';
import ExitManager from './Exit';
import FlowManager from './Flow';
import IfManager from './If';
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
import SetManager from './Set';
import SpeakManager from './Speak';
import StartManager from './Start';
import StreamManager from './Stream';
import UserInfoManager from './UserInfo';
import VisualManager from './Visual';

export const MANAGERS_BY_TYPE = {
  [BlockType.START]: StartManager,
  [BlockType.SPEAK]: SpeakManager,
  [BlockType.CHOICE]: ChoiceManager,
  [BlockType.CHOICE_OLD]: ChoiceOldManager,
  [BlockType.COMBINED]: CombinedManager,
  [BlockType.COMMENT]: CommentManager,
  [BlockType.COMMAND]: CommandManager,
  [BlockType.SET]: SetManager,
  [BlockType.SETV2]: SetManager,
  [BlockType.IF]: IfManager,
  [BlockType.IFV2]: IfManager,
  [BlockType.CAPTURE]: CaptureManager,
  [BlockType.RANDOM]: RandomManager,
  [BlockType.INTENT]: IntentManager,
  [BlockType.STREAM]: StreamManager,
  [BlockType.INTEGRATION]: IntegrationManager,
  [BlockType.FLOW]: FlowManager,
  [BlockType.CODE]: CodeManager,
  [BlockType.EXIT]: ExitManager,
  [BlockType.CARD]: CardManager,
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

const MANAGERS = Object.values(MANAGERS_BY_TYPE);

export default MANAGERS;

export const getManager = <T extends keyof typeof MANAGERS_BY_TYPE>(type: T): typeof MANAGERS_BY_TYPE[T] =>
  MANAGERS_BY_TYPE[type] || MANAGERS_BY_TYPE[BlockType.DEPRECATED];
