import { ProjectLinkType } from '@voiceflow/api-sdk';

import { Nullable, PathPoints } from '@/types';

export type LinkDataCaption = {
  value: string;
  width: number;
  height: number;
};

export type LinkData = {
  type?: Nullable<ProjectLinkType>;
  color?: Nullable<string>;
  points?: Nullable<PathPoints>;
  caption?: Nullable<LinkDataCaption>;
};

export type Link = {
  id: string;
  source: {
    nodeID: string;
    portID: string;
  };
  target: {
    nodeID: string;
    portID: string;
  };
  data?: LinkData;
};

export type DBLink = {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  virtual?: {
    nodeID: string;
    portID: string;
  };
};
