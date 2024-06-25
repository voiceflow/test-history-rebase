import type { BlockType } from '@realtime-sdk/constants';
import type { Node, NodeData } from '@realtime-sdk/models';
import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config/backend';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { VersionAdapterContext } from '../types';
import type { OutPortsAdapter, OutPortsAdapterV2 } from './block';
import { defaultOutPortsAdapter, defaultOutPortsAdapterV2, getOutPortsAdapter, getOutPortsAdapterV2 } from './block';
import type { PortsInfo } from './block/utils';

const stepPortsAdapter = createMultiAdapter<
  BaseModels.StepOnlyData<BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]>,
  PortsInfo,
  [{ platform: Platform.Constants.PlatformType; nodeType: BlockType; dbNode: BaseModels.BaseDiagramNode }],
  [
    {
      platform: Platform.Constants.PlatformType;
      node: Node;
      data: NodeData<unknown>;
      context: VersionAdapterContext;
    },
  ]
>(
  (dbData, { platform, nodeType, dbNode }) => {
    const outPortAdapter = getOutPortsAdapter(platform)?.[nodeType] || (defaultOutPortsAdapter as OutPortsAdapter);
    const outPortAdapterV2 =
      getOutPortsAdapterV2(platform)?.[nodeType] || (defaultOutPortsAdapterV2 as OutPortsAdapterV2);

    return dbData.portsV2
      ? outPortAdapterV2.fromDB(dbData.portsV2, { node: dbNode })
      : outPortAdapter.fromDB(dbData.ports ?? [], { node: dbNode });
  },
  ({ builtIn, dynamic, byKey = {} }, { platform, node, data }) => {
    const allPorts = [...Object.values(byKey), ...Object.values(builtIn), ...dynamic].filter((port) => port);
    const builtInPortTypes = Utils.object.getKeys(builtIn);
    const byKeyPortKeys = Utils.object.getKeys(byKey);
    const hasPorts = allPorts.length > 0 && (builtInPortTypes.length || dynamic.length || byKeyPortKeys.length);

    if (!hasPorts) return { portsV2: { builtIn: {}, dynamic: [], byKey: {} } };

    const outPortAdapter =
      getOutPortsAdapterV2(platform)?.[node.type] || (defaultOutPortsAdapterV2 as OutPortsAdapterV2);
    const dbPorts = outPortAdapter.toDB({ dynamic, builtIn, byKey }, { node, data });

    return { portsV2: dbPorts };
  }
);

export default stepPortsAdapter;
