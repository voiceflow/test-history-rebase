import { AnyRecord, BasePlatformData, Member, Project as BaseProject, ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';
import { PlatformType } from '@voiceflow/internal';

export interface Project<D extends AnyRecord, M extends Member<any>> {
  id: string;
  name: string;
  image: string | null;
  module: string;
  isLive: boolean;
  locales: string[];
  created: string;
  privacy?: ProjectPrivacy;
  linkType: ProjectLinkType;
  platform: PlatformType;
  diagramID: string;
  versionID: string;
  members: M[];
  platformData: D;
  reportTags: Record<string, { tagID: string; label: string }>;
}

export type AnyProject = Project<AnyRecord, Member<any>>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DBProject extends BaseProject<BasePlatformData, BasePlatformData> {}
