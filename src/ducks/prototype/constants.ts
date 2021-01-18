import { InputMode, PrototypeMode, PrototypeState, PrototypeStatus } from './types';

export const STATE_KEY = 'prototype';

export const INITIAL_STATE: PrototypeState = {
  ID: null,
  status: PrototypeStatus.IDLE,
  muted: false,
  startTime: 0,
  inputMode: InputMode.TEXT,
  activePathBlockIDs: [],
  activePathLinkIDs: [],
  showChips: true,
  autoplay: false,
  mode: PrototypeMode.CANVAS,
  visual: {
    device: null,
    sourceID: null,
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
};
