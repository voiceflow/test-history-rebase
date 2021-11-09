import * as Realtime from '@voiceflow/realtime-sdk';

import { Action, ActionPayload } from '@/store/types';

import { createAction } from '../utils';

export enum CreatorAction {
  INITIALIZE_CREATOR = 'CREATOR:INITIALIZE',
  RESET_CREATOR = 'CREATOR:RESET',
}

// action types

export type InitializeCreator = Action<
  CreatorAction.INITIALIZE_CREATOR,
  {
    diagramID: string;
    rootNodeIDs: string[];
    nodes: Realtime.Node[];
    links: Realtime.Link[];
    ports: Realtime.Port[];
    data: Record<string, Realtime.NodeData<unknown>>;
    markupNodeIDs: string[];
  }
>;

export type ResetCreator = Action<CreatorAction.RESET_CREATOR>;

export type AnyCreatorAction = InitializeCreator | ResetCreator;

// action creators

export const initializeCreator = (payload: ActionPayload<InitializeCreator>): InitializeCreator =>
  createAction(CreatorAction.INITIALIZE_CREATOR, payload);

export const resetCreator = (): ResetCreator => createAction(CreatorAction.RESET_CREATOR);
