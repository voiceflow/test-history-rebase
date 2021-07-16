/* eslint-disable @typescript-eslint/ban-types */

export interface Viewer {
  creatorID: number;
  name: string;
  image?: string;
}

export type Coords = [number, number];

export interface BaseWorkspacePayload {
  workspaceID: string;
}

export type ProjectPayload<T extends Record<string, any> = {}> = {
  projectID: string;
} & T;

export type DiagramPayload<T extends Record<string, any> = {}> = ProjectPayload<
  {
    diagramID: string;
  } & T
>;

export type LinkPayload<T extends Record<string, any> = {}> = DiagramPayload<
  {
    linkID: string;
  } & T
>;

export type NodePayload<T extends Record<string, any> = {}> = DiagramPayload<
  {
    nodeID: string;
  } & T
>;

export type BlockPayload<T extends Record<string, any> = {}> = DiagramPayload<
  {
    blockID: string;
  } & T
>;
