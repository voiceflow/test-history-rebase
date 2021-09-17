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

// TODO: move below to @voiceflow/common
export type Nullable<T> = T | null;

export type Nullish<T> = Nullable<T> | undefined;

export type NormalizedValue<T> = T extends Normalized<infer R> ? R : never;

export interface Normalized<T> {
  byKey: Record<string, T>;
  allKeys: string[];
}

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
// TODO: move above to @voiceflow/common

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseCreatorPayload {}

export interface BaseWorkspacePayload {
  workspaceID: string;
}

export interface BaseProjectPayload extends BaseWorkspacePayload {
  projectID: string;
}

export interface BaseDiagramPayload extends BaseProjectPayload {
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
