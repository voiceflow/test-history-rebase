import { ProjectLinkType } from '@voiceflow/api-sdk';

import { Nullable, PathPoints } from '../types';

export interface LinkDataCaption {
  value: string;
  width: number;
  height: number;
}

export interface LinkData {
  type?: Nullable<ProjectLinkType>;
  color?: Nullable<string>;
  points?: Nullable<PathPoints>;
  caption?: Nullable<LinkDataCaption>;
}

export interface Link {
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
}

export interface DBLink {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  virtual?: {
    nodeID: string;
    portID: string;
  };
}
