import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, nextNoMatchNoReplyOutPortsAdapter } from '../utils';

const captureV2Adapter = createBlockAdapter<
  Omit<BaseNode.CaptureV2.StepData, 'capture' | 'noMatch' | 'noReply'>,
  Omit<NodeData.CaptureV2, 'variable' | 'intent' | 'capture' | 'noMatch' | 'noReply' | 'captureType'>
>(
  ({ intentScope }) => ({ intentScope }),
  ({ intentScope }) => ({ intentScope })
);

export const captureV2OutPortsAdapter = createOutPortsAdapter<NodeData.CaptureV2BuiltInPorts, NodeData.CaptureV2>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.toDB(dbPorts, options)
);

export default captureV2Adapter;
