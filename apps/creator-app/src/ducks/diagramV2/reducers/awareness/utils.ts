/* eslint-disable no-param-reassign */

import type { Draft } from 'immer';

import type { DiagramState } from '../../types';

export const removeDiagramLocks = (state: Draft<DiagramState>) => (diagramID: string) => {
  delete state.awareness.locks[diagramID];
};
