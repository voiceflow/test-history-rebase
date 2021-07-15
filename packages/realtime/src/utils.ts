/* eslint-disable @typescript-eslint/ban-types */
import { Resender } from '@logux/server/base-server';
import * as Realtime from '@voiceflow/realtime-sdk';
import moize, { Options as MoizeOptions } from 'moize';
import { Action } from 'typescript-fsa';

import type Server from './server';

const DEFAULT_MOIZE_OPTIONS: MoizeOptions = {
  maxAge: 5 * 60 * 1000,
  maxSize: 100,
  isPromise: true,
  updateExpire: true,
};

export const createWorkspaceAuthorizer = () =>
  moize((server: Server, userID: number, workspaceID: string): Promise<boolean> => server.client.workspace.canRead(userID, workspaceID), {
    transformArgs: ([, userID, workspaceID]) => [userID, workspaceID],
    ...DEFAULT_MOIZE_OPTIONS,
  });

export const createProjectAuthorizer = () =>
  moize((server: Server, userID: number, projectID: string): Promise<boolean> => server.client.project.canRead(userID, projectID), {
    transformArgs: ([, userID, projectID]) => [userID, projectID],
    ...DEFAULT_MOIZE_OPTIONS,
  });

export const createVersionAuthorizer = () =>
  moize((server: Server, userID: number, versionID: string): Promise<boolean> => server.client.version.canRead(userID, versionID), {
    transformArgs: ([, userID, versionID]) => [userID, versionID],
    ...DEFAULT_MOIZE_OPTIONS,
  });

export const createDiagramAuthorizer = () =>
  moize((server: Server, userID: number, diagramID: string): Promise<boolean> => server.client.diagram.canRead(userID, diagramID), {
    transformArgs: ([, userID, diagramID]) => [userID, diagramID],
    ...DEFAULT_MOIZE_OPTIONS,
  });

export const resendProjectChannel: Resender<Action<Realtime.ProjectPayload>, {}, {}> = (_ctx, action) => ({
  channel: Realtime.Channels.project({ projectID: action.payload.projectID }),
});

export const resendDiagramChannel: Resender<Action<Realtime.DiagramPayload>, {}, {}> = (_ctx, action) => ({
  channel: Realtime.Channels.diagram({ diagramID: action.payload.diagramID }),
});
