import { ClassName, Identifier } from '@/styles/constants';

import { $, $$, cls, id } from './helpers';

const PROTOTYPE = {
  sendButton: () => $(id(Identifier.PROTOTYPE_RESPONSE_SEND)),
  startButton: () => $(id(Identifier.PROTOTYPE_START)),
  restartButton: () => $(cls(ClassName.SVG_ICON, 'randomLoop')),
  speakMessages: () => $$(cls(ClassName.CHAT_DIALOG_SPEAK_MESSAGE)),

  responseInput: () => $<HTMLInputElement>(id(Identifier.PROTOTYPE_RESPONSE)),
} as const;

export default PROTOTYPE;
