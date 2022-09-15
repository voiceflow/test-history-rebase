import { BlockType } from '@realtime-sdk/constants';
import { Node, NodeData } from '@realtime-sdk/models';
import { SchemaVersion } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import { VersionAdapterContext } from '../types';
import {
  defaultOutPortsAdapter,
  defaultOutPortsAdapterV2,
  getOutPortsAdapter,
  getOutPortsAdapterV2,
  OutPortsAdapter,
  OutPortsAdapterV2,
} from './block';
import { PortsInfo, removePortDataFalsyValues } from './block/utils';

const stepPortsAdapter = createMultiAdapter<
  BaseModels.StepOnlyData<BaseModels.AnyBaseStepPorts, BaseModels.BasePort[]>,
  PortsInfo,
  [{ platform: VoiceflowConstants.PlatformType; nodeType: BlockType; dbNode: BaseModels.BaseDiagramNode }],
  [
    {
      platform: VoiceflowConstants.PlatformType;
      node: Node;
      data: NodeData<unknown>;
      context: VersionAdapterContext;
    }
  ]
>(
  (dbData, { platform, nodeType, dbNode }) => {
    const outPortAdapter = getOutPortsAdapter(platform)?.[nodeType] || (defaultOutPortsAdapter as OutPortsAdapter);
    const outPortAdapterV2 = getOutPortsAdapterV2(platform)?.[nodeType] || (defaultOutPortsAdapterV2 as OutPortsAdapterV2);

    return dbData.ports ? outPortAdapter.fromDB(dbData.ports, { node: dbNode }) : outPortAdapterV2.fromDB(dbData.portsV2, { node: dbNode });
  },
  ({ builtIn, dynamic, byKey = {} }, { platform, node, data, context }) => {
    const allPorts = [...Object.values(byKey), ...Object.values(builtIn), ...dynamic].filter((port) => port);
    const builtInPortTypes = Utils.object.getKeys(builtIn);
    const byKeyPortKeys = Utils.object.getKeys(byKey);
    const hasPorts = allPorts.length > 0 && (builtInPortTypes.length || dynamic.length || byKeyPortKeys.length);

    if (context.schemaVersion >= SchemaVersion.V2) {
      if (!hasPorts) return { portsV2: { builtIn: {}, dynamic: [], byKey: {} } };

      const outPortAdapter = getOutPortsAdapterV2(platform)?.[node.type] || (defaultOutPortsAdapterV2 as OutPortsAdapterV2);
      const dbPorts = outPortAdapter.toDB({ dynamic, builtIn, byKey }, { node, data });

      return { portsV2: dbPorts };
    }

    if (hasPorts) {
      const outPortAdapter = getOutPortsAdapter(platform)?.[node.type] || (defaultOutPortsAdapter as OutPortsAdapter);
      const dbPorts = outPortAdapter.toDB({ dynamic, builtIn, byKey }, { node, data });

      if (dbPorts.length) {
        return { ports: dbPorts.map(removePortDataFalsyValues) };
      }
    }

    return { ports: [] };
  }
);

export default stepPortsAdapter;
