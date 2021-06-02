import { AnyRecord, Member, ProjectLinkType, ProjectPrivacy } from '@voiceflow/api-sdk';

import { PlatformType } from '@/constants';

export type Project<D extends AnyRecord, M extends Member<any>> = {
  id: string;
  name: string;
  diagramID: string;
  locales: string[];
  module: string;
  created: string;
  isLive: boolean;
  versionID: string;
  image: string | null;
  platform: PlatformType;
  privacy?: ProjectPrivacy;
  linkType: ProjectLinkType;
  members: M[];
  platformData: D;
};

export type AnyProject = Project<any, Member<any>>;

export type DBProject = {
  project_id: string;
  skill_id: string;
  name: string;
  diagram: string;
  locales: string[];
  module: string;
  platform: PlatformType;
  created: string;
  islive: boolean;
  image: string | undefined;
};

export type Price = {
  price: number;
  errors: {
    coupon?: {
      message: string;
    };
    seats?: {
      message: string;
    };
    period?: {
      message: string;
    };
  };
  discount?: {};
};
