import { ActionCreator } from 'typescript-fsa';

export interface Viewer {
  creatorID: number;
  name: string;
  image?: string;
}

export type Point = [x: number, y: number];

export interface PathPoint {
  point: Point;
  toTop?: boolean;
  locked?: boolean;
  reversed?: boolean;
  allowedToTop?: boolean;
}

export type PathPoints = PathPoint[];

export type ActionPayload<T extends ActionCreator<any>> = ReturnType<T>['payload'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseCreatorPayload {}

export interface BaseWorkspacePayload {
  workspaceID: string;
}

export interface BaseProjectPayload extends BaseWorkspacePayload {
  projectID: string;
}

export interface BaseVersionPayload extends BaseProjectPayload {
  versionID: string;
}

export interface BaseDiagramPayload extends BaseVersionPayload {
  diagramID: string;
}

export interface BaseLinkPayload extends BaseDiagramPayload {
  linkID: string;
}

export interface BaseNodePayload extends BaseDiagramPayload {
  nodeID: string;
}

export interface BaseBlockPayload extends BaseDiagramPayload {
  blockID: string;
}
