import { BlockType } from '@/constants';

import AccountLinkingManager from './AccountLinking';
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
import DisplayManager from './Display';
import ExitManager from './Exit';
import FlowManager from './Flow';
import IfManager from './If';
import IntegrationManager from './Integration';
import IntentManager from './Intent';
import MarkupImageManager from './MarkupImage';
import PaymentManager from './Payment';
import PermissionManager from './Permission';
import RandomManager from './Random';
import ReminderManager from './Reminder';
import SetManager from './Set';
import SpeakManager from './Speak';
import StartManager from './Start';
import StreamManager from './Stream';
import UserInfoManager from './UserInfo';

export const MANAGERS_BY_TYPE = {
  [BlockType.START]: StartManager,
  [BlockType.SPEAK]: SpeakManager,
  [BlockType.CHOICE]: ChoiceManager,
  [BlockType.CHOICE_OLD]: ChoiceOldManager,
  [BlockType.COMBINED]: CombinedManager,
  [BlockType.COMMENT]: CommentManager,
  [BlockType.COMMAND]: CommandManager,
  [BlockType.SET]: SetManager,
  [BlockType.IF]: IfManager,
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
  [BlockType.DEPRECATED]: DeprecatedManager,
  [BlockType.MARKUP_TEXT]: DeprecatedManager,
  [BlockType.MARKUP_IMAGE]: MarkupImageManager,
  [BlockType.MARKUP_SHAPE]: DeprecatedManager,
};

const MANAGERS = Object.values(MANAGERS_BY_TYPE);

export default MANAGERS;

export const getManager = <T extends keyof typeof MANAGERS_BY_TYPE>(type: T): typeof MANAGERS_BY_TYPE[T] =>
  MANAGERS_BY_TYPE[type] || MANAGERS_BY_TYPE[BlockType.DEPRECATED];
