import { NodeData } from '@realtime-sdk/models';

import blockDataAdapter, { BlockData } from './block';
import { createBlockAdapter } from './utils';

export interface StartData extends BlockData {
  label?: string;
}

const startDataAdapter = createBlockAdapter<StartData, NodeData.Start>(
  ({ label = '', ...data }) => ({ ...blockDataAdapter.fromDB(data), label }),
  ({ label, ...data }) => ({ ...blockDataAdapter.toDB(data), label: label || undefined })
);

export default startDataAdapter;
