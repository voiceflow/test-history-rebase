import { Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';
import { voiceButtonsAdapter } from '../voice';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData, NodeData.Buttons>(
  (data) => voiceButtonsAdapter.fromDB(data),
  (data) => voiceButtonsAdapter.toDB(data)
);

export default buttonsAdapter;
