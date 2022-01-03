import { NodeData } from '../../../../models';
import { createOutPortsAdapter, nextNoMatchNoReplyOutPortsAdapter } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const captureV2OutPortsAdapter = createOutPortsAdapter<NodeData.CaptureV2BuiltInPorts, NodeData.CaptureV2>(
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextNoMatchNoReplyOutPortsAdapter.toDB(dbPorts, options)
);
