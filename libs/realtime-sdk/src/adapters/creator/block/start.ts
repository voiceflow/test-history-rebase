import type { NodeData } from '@/models';

import type { BlockData } from './block';
import blockDataAdapter from './block';
import { createBlockAdapter } from './utils';

export interface StartData extends BlockData {
  label?: string;
}

const startDataAdapter = createBlockAdapter<StartData, NodeData.Start>(
  ({ label = '', ...data }, options) => ({ ...blockDataAdapter.fromDB(data, options), label }),
  ({ label, ...data }, options) => ({ ...blockDataAdapter.toDB(data, options), label: label || undefined })
);

export default startDataAdapter;
