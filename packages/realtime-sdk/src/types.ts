/* eslint-disable @typescript-eslint/ban-types */

export interface Viewer {
  creatorID: number;
  name: string;
  image: string;
}

export type Coords = [number, number];

export type ProjectPayload<T extends Record<string, any> = {}> = {
  projectID: string;
} & T;

export type DiagramPayload<T extends Record<string, any> = {}> = {
  diagramID: string;
} & T;
