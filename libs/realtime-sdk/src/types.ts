import type { SchemaVersion } from '@realtime-sdk/schema-version/schema-version.enum';
import type { BaseModels } from '@voiceflow/base-types';
import type { AnyRecord, Nullish, Struct, Utils } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config/backend';
import type { ActionCreator } from 'typescript-fsa';

export enum ErrorCode {
  CANNOT_CONVERT_TO_TOPIC = 1000,
  MIGRATION_IN_PROGRESS = 1001,
  SCHEMA_VERSION_NOT_SUPPORTED = 1002,
  ALREADY_MEMBER_OF_WORKSPACE = 1003,
  CHECKOUT_FAILED = 1004,
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
  nlu: Platform.Constants.NLUType;
  type: Platform.Constants.ProjectType;
  platform: Platform.Constants.PlatformType;
}

export type ActionPayload<T extends ActionCreator<any>> = ReturnType<T>['payload'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseCreatorPayload {}

export interface BaseWorkspacePayload {
  context?: { broadcastOnly?: boolean };
  workspaceID: string;
}

export interface BaseOrganizationPayload {
  organizationID: string;
}

export interface BaseProjectPayload extends BaseWorkspacePayload {
  projectID: string;
}

export interface BaseVersionPayload extends BaseProjectPayload {
  versionID: string;
}

/**
 * @deprecated remove when cms workspace is released
 */
export interface BaseDomainPayload extends BaseVersionPayload {
  /**
   * @deprecated remove when cms workspace is released
   */
  domainID: string | null;
}

export interface BaseDiagramPayload extends BaseDomainPayload {
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

export interface ByKeyPortDelete {
  portID?: never;
  key: string;
  type?: never;
}

export interface DynamicPortDelete {
  portID: string;
  key?: never;
  type?: never;
}

export interface BuiltInPortDelete {
  portID?: never;
  key?: never;
  type: BaseModels.PortType;
}

export type PortDelete = ByKeyPortDelete | DynamicPortDelete | BuiltInPortDelete;

export interface NodePortRemap {
  nodeID: string;
  ports: PortDelete[];
  targetNodeID: string | null;
}

export interface RemoveNode {
  stepID?: Nullish<string>;
  parentNodeID: string;
}

export interface NodePortRemapsPayload {
  nodePortRemaps?: NodePortRemap[];
}

export interface ByKeyLinkPatch {
  nodeID: string;
  portID?: never;
  type?: never;
  key: string;
  data: Struct;
  target?: string;
}

export interface BuiltInLinkPatch {
  nodeID: string;
  portID?: never;
  type: BaseModels.PortType;
  key?: never;
  data: Struct;
  target?: string;
}

export interface DynamicLinkPatch {
  nodeID: string;
  portID: string;
  type?: never;
  key?: never;
  data: Struct;
  target?: string;
}

export type LinkPatch = ByKeyLinkPatch | BuiltInLinkPatch | DynamicLinkPatch;

export interface ByKeyLinkDelete {
  nodeID: string;
  portID?: never;
  type?: never;
  key: string;
}

export interface BuiltInLinkDelete {
  nodeID: string;
  portID?: never;
  type: BaseModels.PortType;
  key?: never;
}

export interface DynamicLinkDelete {
  nodeID: string;
  portID: string;
  type?: never;
  key?: never;
}

export type LinkDelete = ByKeyLinkDelete | BuiltInLinkDelete | DynamicLinkDelete;

export type ArrayItem<T extends ArrayLike<unknown>> = T[number];
export type ObjectValue<T extends AnyRecord> = T[keyof T];
