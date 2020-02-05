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
import PaymentManager from './Payment';
import PermissionManager from './Permission';
import RandomManager from './Random';
import ReminderManager from './Reminder';
import SetManager from './Set';
import SpeakManager from './Speak';
import StartManager from './Start';
import StreamManager from './Stream';
import UserInfoManager from './UserInfo';

const MANAGERS = [
  StartManager,
  SpeakManager,
  ChoiceManager,
  CombinedManager,
  CommandManager,
  CommentManager,
  SetManager,
  IfManager,
  CaptureManager,
  RandomManager,
  IntentManager,
  StreamManager,
  IntegrationManager,
  FlowManager,
  CodeManager,
  ExitManager,
  CardManager,
  DisplayManager,
  PermissionManager,
  AccountLinkingManager,
  UserInfoManager,
  PaymentManager,
  CancelPaymentManager,
  ReminderManager,
  DeprecatedManager,
  ChoiceOldManager,
];

export default MANAGERS;

export const NODE_MANAGERS = MANAGERS.reduce((acc, manager) => {
  // eslint-disable-next-line no-param-reassign
  acc[manager.type] = manager;

  return acc;
}, {});

export const getManager = (type) => NODE_MANAGERS[type] || NODE_MANAGERS[BlockType.DEPRECATED];
