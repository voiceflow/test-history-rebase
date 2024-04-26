import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { creatorStateSelector } from './base';

export const allPortsByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ ports }, portIDs) =>
  Normal.getMany(ports, portIDs)
);

export const portsByNodeIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ portsByNodeID }, nodeID) =>
    nodeID
      ? portsByNodeID[nodeID] ?? Realtime.Utils.port.createEmptyNodePorts()
      : Realtime.Utils.port.createEmptyNodePorts()
);

export const builtInPortTypeSelector = createSelector(
  [creatorStateSelector, createCurriedSelector(portsByNodeIDSelector), idParamSelector],
  ({ nodeIDByPortID }, getPorts, portID) => {
    const nodeID = portID && nodeIDByPortID[portID];
    if (!nodeID) return null;

    const found = Object.entries(getPorts({ id: nodeID }).out.builtIn).find(([, value]) => value === portID);
    if (!found) return null;

    return found[0] as BaseModels.PortType;
  }
);
