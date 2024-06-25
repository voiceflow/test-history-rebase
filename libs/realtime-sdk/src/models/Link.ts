import type { PathPoints } from '@realtime-sdk/types';
import type { BaseModels } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';

export interface LinkDataCaption {
  value: string;
  width: number;
  height: number;
}

export interface LinkData {
  type?: Nullable<BaseModels.Project.LinkType>;
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
