import { PlatformType } from '@/constants';

export type Project = {
  id: string;
  name: string;
  diagramID: string;
  locales: string[];
  module: string;
  created: string;
  reference: boolean;
  isLive: boolean;
  versionID: string;
  smallIcon: string | null;
  largeIcon: string | null;
};

export namespace Project {
  export type ImportToken = {
    projectId: string;
    projectName: string;
  };
}

export type DBProject = {
  project_id: string;
  skill_id: string;
  name: string;
  diagram: string;
  locales: string[];
  module: string;
  platform: PlatformType;
  reference: boolean;
  created: string;
  islive: boolean;
  small_icon: string | null;
  large_icon: string | null;
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
