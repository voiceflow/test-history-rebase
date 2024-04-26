import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextNoMatchNoReplyOutPortsAdapter,
  nextNoMatchNoReplyOutPortsAdapterV2,
} from '../utils';

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

export const captureV2OutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CaptureV2BuiltInPorts, NodeData.CaptureV2>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default captureV2Adapter;
