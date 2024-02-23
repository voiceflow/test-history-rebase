import moize from 'moize';
import { createCachedSelector as reReselectCreateCachedSelector, FlatObjectCache } from 're-reselect';
import { createSelector } from 'reselect';

import type { State } from '@/ducks';
import type { Selector } from '@/store/types';

export const createSubSelector = <T extends Record<string, any>, K extends keyof T>(selector: (state: any) => T, key: K) =>
  createSelector(selector, (state) => state[key] as T[K]);

export const createRootSelectorFactory =
  <S extends Record<string, any>>() =>
  <K extends keyof S>(stateKey: K): ((state: S) => S[K]) =>
    moize(({ [stateKey]: state }) => state);

export const createRootSelector = createRootSelectorFactory<State>();

export const createParameterSelector =
  <T extends Record<string, any>, R>(selector: (params: T) => R) =>
  (_: unknown, params: T): ReturnType<typeof selector> =>
    selector(params);

export const creatorIDParamSelector = createParameterSelector((params: { creatorID: number | null }) => params.creatorID);

export const projectIDParamSelector = createParameterSelector((params: { projectID: string }) => params.projectID);

export const diagramIDParamSelector = createParameterSelector((params: { diagramID?: string | null }) => params.diagramID);

export const nodeIDParamSelector = createParameterSelector((params: { nodeID: string }) => params.nodeID);

export const assistantIDParamSelector = createParameterSelector((params: { assistantID: string | null }) => params.assistantID);

export const createCurriedSelector =
  <T, P>(selector: Selector<T, [P]>) =>
  (state: State) =>
  (param: P): T =>
    selector(state, param);

export const createCachedSelectorFactory = (): { clearAllCache: VoidFunction; createCachedSelector: typeof reReselectCreateCachedSelector } => {
  const cacheObjects: FlatObjectCache[] = [];

  const createCachedSelector =
    (...args: [any, any]) =>
    (props: any) => {
      const options = typeof props === 'function' ? { keySelector: props } : props;
      const cacheObject = new FlatObjectCache();
      cacheObjects.push(cacheObject);

      return reReselectCreateCachedSelector(...args)({
        ...options,
        cacheObject,
      });
    };

  const clearAllCache = () => cacheObjects.forEach((cache) => cache.clear());

  return {
    clearAllCache,
    createCachedSelector: createCachedSelector as any,
  };
};
