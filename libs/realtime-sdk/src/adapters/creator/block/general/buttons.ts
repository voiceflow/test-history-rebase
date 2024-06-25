import type { NodeData } from '@realtime-sdk/models';
import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { createBlockAdapter } from '../utils';
import { voiceButtonsAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const buttonsAdapter = createBlockAdapter<VoiceflowNode.Buttons.VoiceStepData, NodeData.Buttons>(
  (data, options) => voiceButtonsAdapter.fromDB(data, options),
  (data, options) => voiceButtonsAdapter.toDB(data, options)
);

export default buttonsAdapter;
