import type { Enum } from '@/utils/type/enum.util';

export const NodeType = {
  TEXT: 'text',
  NEXT: '_next',
  BLOCK: 'block',
  START: 'start',
  INTENT: 'intent',
  ACTIONS: 'actions',
  TRIGGER: 'trigger',
  MESSAGE: 'message',
  BUTTONS: 'buttons',
  FUNCTION: 'function',
  RESPONSE: 'response',
  COMPONENT: 'component',
  CHOICE_V2: 'choice-v2',
  BUTTONS_V2: 'buttons-v2',
  CAPTURE_V3: 'capture-v3',
  INTERACTION: 'interaction',
} as const;

export type NodeType = Enum<typeof NodeType>;
