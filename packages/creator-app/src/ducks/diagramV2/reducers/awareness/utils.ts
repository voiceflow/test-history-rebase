/* eslint-disable no-param-reassign */

import { Draft } from 'immer';

import { DiagramState } from '../../types';

export const removeDiagramLocks = (state: Draft<DiagramState>) => (diagramID: string) => {
  delete state.awareness.locks[diagramID];
};
