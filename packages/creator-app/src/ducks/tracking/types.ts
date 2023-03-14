import { AnyRecord } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { AnalyticsClient } from '@voiceflow/sdk-analytics';

import { SyncThunk } from '@/store/types';

export type EventTracker<T> = (...args: T extends AnyRecord ? [properties: T] : [properties?: unknown]) => SyncThunk;

export type AnalyticsTrackEvent = Parameters<AnalyticsClient['track']>[0];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrackingState {}

export interface BaseEventInfo {
  creatorID?: number;
}

export interface OrganizationEventInfo extends BaseEventInfo {
  organizationID: string | null;
}

export interface WorkspaceEventInfo extends OrganizationEventInfo {
  workspaceID: string;
}

export interface ProjectEventInfo extends WorkspaceEventInfo {
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  projectID: string;
  projectType: Platform.Constants.ProjectType;
}

export interface VersionEventInfo extends ProjectEventInfo {
  versionID: string;
}

export interface DiagramEventInfo extends VersionEventInfo {
  diagramID: string;
}

export interface ProjectSessionEventInfo extends Omit<VersionEventInfo, 'anonymousID'> {}

export interface Event<P extends AnyRecord> extends Omit<AnalyticsTrackEvent, 'envIDs' | 'hashedIDs' | 'workspaceHashedIDs'> {
  envIDs?: (keyof P)[];
  hashedIDs?: (keyof P)[];
  workspaceHashedIDs?: (keyof P)[];
}

export interface EventOptions<K> {
  envIDs?: K[];
  hashedIDs?: K[];
  workspaceHashedIDs?: K[];
}

export type OrganizationEvent<P extends AnyRecord> = Event<P & { organization_id?: NonNullable<OrganizationEventInfo['organizationID']> }>;
export type WorkspaceEvent<P extends AnyRecord> = OrganizationEvent<P & { workspace_id: WorkspaceEventInfo['workspaceID'] }>;
export type ProjectEvent<P extends AnyRecord> = WorkspaceEvent<
  P & {
    project_id: ProjectEventInfo['projectID'];
    project_nlu: Platform.Constants.NLUType;
    project_type: Platform.Constants.ProjectType;
    project_platform: Platform.Constants.PlatformType;
  }
>;
export type VersionEvent<P extends AnyRecord> = ProjectEvent<P & { version_id: VersionEventInfo['versionID'] }>;
export type DiagramEvent<P extends AnyRecord> = VersionEvent<P & { diagram_id: DiagramEventInfo['diagramID'] }>;

export type BaseOnlyKeys<T extends keyof any> = Exclude<T, 'creatorID' | 'anonymousID'>;
export type OrganizationOnlyKeys<T extends keyof any> = BaseOnlyKeys<Exclude<T, 'organizationID'>>;
export type WorkspaceOnlyKeys<T extends keyof any> = OrganizationOnlyKeys<Exclude<T, 'workspaceID'>>;
export type ProjectOnlyKeys<T extends keyof any> = WorkspaceOnlyKeys<Exclude<T, 'nluType' | 'platform' | 'projectID' | 'projectType'>>;
export type VersionOnlyKeys<T extends keyof any> = ProjectOnlyKeys<Exclude<T, 'versionID'>>;
export type DiagramOnlyKeys<T extends keyof any> = VersionOnlyKeys<Exclude<T, 'diagramID'>>;
