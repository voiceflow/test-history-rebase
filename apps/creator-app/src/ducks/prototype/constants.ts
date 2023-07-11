import { Utils } from '@voiceflow/common';

import { PrototypeInputMode, PrototypeStatus } from '@/constants/prototype';

import { PrototypeState } from './types';

export const STATE_KEY = 'prototype';

export const EMPTY_CONTEXT = {
  turn: {},
  trace: [],
  stack: [],
  storage: {},
  variables: {},
};

export const INITIAL_STATE: PrototypeState = {
  sessionID: Utils.id.cuid(),
  status: PrototypeStatus.IDLE,
  muted: false,
  startTime: 0,
  inputMode: PrototypeInputMode.TEXT,
  activePaths: {},
  showButtons: true,
  autoplay: false,
  visual: {
    data: null,
    device: null,
    dataHistory: [],
  },
  contextStep: 0,
  contextHistory: [],
  flowIDHistory: [],
  context: EMPTY_CONTEXT,
  webhook: null,
  settings: {},
  selectedPersonaID: null,
};
