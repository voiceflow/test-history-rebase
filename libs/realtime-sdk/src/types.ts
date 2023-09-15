import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Nullish, Struct, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import { ActionCreator } from 'typescript-fsa';

export enum SchemaVersion {
  V1 = 1,

  /**
   * migrate to the new portsV2 structure
   */
  V2 = 2,

  /**
   * add missing ports to carousel steps to fix CT-582
   */
  V2_1 = 2.1,

  /**
   * center align image markup nodes
   */
  V2_2 = 2.2,

  /**
   * remove invalid entities from utterances in IMM
   */
  V2_3 = 2.3,

  /**
   * force migrate
   */
  V2_4 = 2.4,

  /**
   * migrate the "go to intent" and "url" node data into the "go to intent" and "url" action nodes
   */
  V2_5 = 2.5,

  /**
   * migrate the set "value" type into the "advance" type
   */
  V2_6 = 2.6,

  /**
   * migrate the block color and name for start blocks and blocks with the only intent step
   */
  V2_7 = 2.7,

  /**
   * migrate to the topics and components
   */
  V3_0 = 3.0,

  /**
   * adds root diagram id to topics
   */
  V3_1 = 3.1,

  /**
   * restores version with a rootDiagramID that points to a non-existent diagram
   */
  V3_2 = 3.2,

  /**
   * forces step data out of the ports for trace (custom action) step and into "paths" property
   */
  V3_3 = 3.3,

  /**
   * adds missing components to versions component list so all components are visible in the menu
   */
  V3_4 = 3.4,

  /**
   * migrate the old random step to random step v2
   */
  V3_5 = 3.5,

  /**
   * renames intentStepIDs into menuNodeIDs and adds components and start nodes into it
   */
  V3_6 = 3.6,

  /**
   * this migration transforms the cardV2 data structure
   */
  V3_7 = 3.7,

  /**
   * this migration transforms card nodes into cardV2s
   */
  V3_8 = 3.8,

  /**
   * migrates to domains
   */
  V3_9 = 3.9,

  /**
   * migrates multiple templates diagrams into one
   */
  V3_91 = 3.91,

  /** fixes ghost components */
  V3_92 = 3.92,

  /** fixes duplicate intents and entities */
  V3_94 = 3.94,

  /** refactor diagram.menuNodeIDs into diagram.menuItems */
  V3_95 = 3.95,

  /** fix diagram.menuItems not defined */
  V3_96 = 3.96,

  /** removes root diagram id from the components list */
  V3_97 = 3.97,

  /**
   * migrate to the new portsV2 structure
   */
  V4_00 = 4.0,

  /**
   * fixes the built-in version intent names
   */
  V4_01 = 4.01,

  /**
   * removes duplicated port ids
   */
  V4_02 = 4.02,

  /**
   * removes components from the topics menu
   */
  V4_03 = 4.03,

  /**
   * cleans duplicate topicIDs from domains and duplicate menuItems from diagrams
   */
  V4_04 = 4.04,

  /**
   * fixes card and carousel steps with filled next prots
   */
  V4_05 = 4.05,

  /**
   * adds none intent to all VFNLU projects
   */
  V4_06 = 4.06,

  /**
   * fill postgres entities table
   */
  V4_07 = 4.07,
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

export interface BaseDomainPayload extends BaseVersionPayload {
  domainID: string;
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
