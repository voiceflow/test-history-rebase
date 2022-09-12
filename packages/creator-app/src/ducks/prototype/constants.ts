import { PrototypeInputMode, PrototypeStatus } from '@/constants/prototype';

import { PrototypeState } from './types';

export const STATE_KEY = 'prototype';

export const INITIAL_STATE: PrototypeState = {
  ID: null,
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
  context: {
    turn: {},
    trace: [],
    stack: [],
    storage: {},
    variables: {},
  },
  webhook: null,
  settings: {},
};
