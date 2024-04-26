import { BlockType } from '@realtime-sdk/constants';
import type { NodeData } from '@realtime-sdk/models';
import type { AnyRecord, BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  dynamicOnlyOutPortsAdapter,
  dynamicOnlyOutPortsAdapterV2,
} from '../utils';

const customBlockPointerAdapter = createBlockAdapter<BaseNode.CustomBlockPointer.StepData, NodeData.Pointer>(
  ({ sourceID, pointerName, parameters }) => ({
    sourceID,
    parameters,
    pointerName,
    pointedType: BlockType.ACTIONS,
  }),
  ({ pointerName, sourceID, parameters }) => ({
    sourceID,
    parameters,
    pointerName,
  })
);

export const customBlockPointerOutPortsAdapter = createOutPortsAdapter<AnyRecord, NodeData.Pointer>(
  (ports, options) => dynamicOnlyOutPortsAdapter.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapter.toDB(ports, options)
);

export const customBlockPointerOutPortsAdapterV2 = createOutPortsAdapterV2<AnyRecord, NodeData.Pointer>(
  (ports, options) => dynamicOnlyOutPortsAdapterV2.fromDB(ports, options),
  (ports, options) => dynamicOnlyOutPortsAdapterV2.toDB(ports, options)
);

export default customBlockPointerAdapter;
