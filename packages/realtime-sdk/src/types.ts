import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { ActionCreator } from 'typescript-fsa';

export enum SchemaVersion {
  V1 = 1,

  /**
   * migrate to the new portsV2 structure
   */
  V2 = 2,

  V2_1 = 2.1,
  V2_2 = 2.2, // center align image markup nodes
  V2_3 = 2.3, // remove invalid entities from utterances in IMM
  V2_4 = 2.4, // force migration
}

export const SUPPORTED_SCHEMA_VERSIONS = Object.values(SchemaVersion)
  .filter((value): value is SchemaVersion => typeof value === 'number')
  .sort((l, r) => l - r);
export const LATEST_SCHEMA_VERSION = SUPPORTED_SCHEMA_VERSIONS[SUPPORTED_SCHEMA_VERSIONS.length - 1];

export enum ErrorCode {
  CANNOT_CONVERT_TO_TOPIC = 1000,
  MIGRATION_IN_PROGRESS = 1001,
  SCHEMA_VERSION_NOT_SUPPORTED = 1002,
  ALREADY_MEMBER_OF_WORKSPACE = 1003,
}

export type RealtimeError = Utils.protocol.AsyncError<ErrorCode>;

export interface Viewer {
  creatorID: number;
  name: string;
  image?: string;
}

export type Point = [x: number, y: number];
export type Pair<T> = [T, T];

export interface PathPoint {
  point: Point;
  toTop?: boolean;
  locked?: boolean;
  reversed?: boolean;
  allowedToTop?: boolean;
}

export type PathPoints = PathPoint[];

export interface ProjectMeta {
  type: VoiceflowConstants.ProjectType;
  platform: VoiceflowConstants.PlatformType;
}

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

export interface BaseParentNodePayload extends BaseDiagramPayload {
  parentNodeID: string;
}

export interface BaseActionsPayload extends BaseDiagramPayload {
  actionsID: string;
}

export interface BasePortPayload extends BaseNodePayload {
  portID: string;
}

export interface ProjectMetaPayload {
  projectMeta: ProjectMeta;
}

export interface SchemaVersionPayload {
  schemaVersion: SchemaVersion;
}

export interface NodePortRemap {
  nodeID: string;
  ports: {
    key?: string;
    type?: string;
    portID: string;
  }[];
  targetNodeID: string | null;
}

export interface NodePortRemapsPayload {
  nodePortRemaps?: NodePortRemap[];
}
