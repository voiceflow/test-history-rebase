import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, nextNoMatchNoReplyOutPortsAdapter } from '../utils';

const captureV2Adapter = createBlockAdapter<Omit<Record<string, unknown>, 'noMatch' | 'noReply'>, Omit<NodeData.CaptureV2, 'noMatch' | 'noReply'>>(
  () => ({}),
  () => ({})
);

export const captureV2OutPortsAdapter = createOutPortsAdapter<NodeData.CaptureV2BuiltInPorts, NodeData.CaptureV2>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.toDB(dbPorts, options)
);

export default captureV2Adapter;
