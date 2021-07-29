import { createRootSelectorFactory } from '@/ducks/utils';

import type { RealtimeState } from '..';

export const createRootSelector = createRootSelectorFactory<RealtimeState>();

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
