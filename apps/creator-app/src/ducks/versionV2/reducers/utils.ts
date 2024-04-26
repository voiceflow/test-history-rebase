import type { Draft } from 'immer';
import * as Normal from 'normal-store';

import { createReducerFactory } from '@/ducks/utils';

import type { VersionState } from '../types';

export const createReducer = createReducerFactory<VersionState>();

export const removeVersionComponent = (state: Draft<VersionState>, versionID: string) => (componentID: string) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  version.components = version.components.filter((component) => component.sourceID !== componentID);
};
