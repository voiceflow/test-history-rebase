import type { BaseModels } from '@voiceflow/base-types';

import type { LinkData } from './Link';

export interface Port {
  id: string;
  nodeID: string;
  label: string | null;
  linkData?: LinkData;
}

export interface DBPortWithLinkData extends BaseModels.BasePort {
  data?: LinkData;
}
