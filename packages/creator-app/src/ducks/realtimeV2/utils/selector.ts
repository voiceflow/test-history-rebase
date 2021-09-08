import { createKeyedSelector, createRootSelector as createGlobalRootSelector } from '@/ducks/utils';

import type { State } from '../..';
import { STATE_KEY } from '../constants';

export const createRootSelector = <K extends keyof State['realtimeV2']>(key: K) => createKeyedSelector(createGlobalRootSelector(STATE_KEY), key);

export const createParameterSelector =
  <T extends Record<string, any>>(selector: <K extends keyof T>(params: T) => T[K]) =>
  (_: unknown, params: T): T[keyof T] =>
    selector(params);

export interface CreatorIDSelectorParameter {
  creatorID: number;
}

export interface ProjectIDSelectorParameter {
  projectID: string;
}

export const creatorIDParamSelector = createParameterSelector<CreatorIDSelectorParameter>((params) => params.creatorID);

export const projectIDParamSelector = createParameterSelector<ProjectIDSelectorParameter>((params) => params.projectID);
