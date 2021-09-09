import moize from 'moize';

import type { State } from '@/ducks';
import { Selector } from '@/store/types';

export { createAction } from '@voiceflow/ui';

export const createKeyedSelector = <S extends Selector<any>, K extends keyof ReturnType<S>>(
  selector: S,
  stateKey: K
): ((state: State) => ReturnType<S>[K]) => moize.simple((state) => selector(state)[stateKey]);

export const createRootSelectorFactory =
  <S extends Record<string, any>>() =>
  <K extends keyof S>(stateKey: K): ((state: S) => S[K]) =>
    moize.simple(({ [stateKey]: state }) => state);

export const createRootSelector = createRootSelectorFactory<State>();

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
