import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorV1Selectors from '@/ducks/creator/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createCurriedSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { creatorStateSelector } from './base';

const _portByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ ports }, portID) =>
  portID ? Normal.getOne(ports, portID) : null
);
export const portByIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.portByIDSelector, _portByIDSelector, idParamSelector],
  (getPortV1, portV2, portID) => [portID ? getPortV1(portID) : null, portV2]
);

export const getPortByIDSelector = createCurriedSelector(portByIDSelector);

const _allPortsByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ ports }, portIDs) => Normal.getMany(ports, portIDs));
export const allPortsByIDsSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.allPortsByIDsSelector, _allPortsByIDsSelector, idsParamSelector],
  (getPortsV1, portsV2, portIDs) => [getPortsV1(portIDs), portsV2]
);

const _portsByNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ portsByNodeID }, nodeID) =>
  nodeID ? portsByNodeID[nodeID] ?? Realtime.Utils.port.createEmptyNodePorts() : Realtime.Utils.port.createEmptyNodePorts()
);
export const portsByNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.nodeByIDSelector, _portsByNodeIDSelector, idParamSelector],
  (getNodeV1, portsV2, nodeID) => [
    nodeID ? getNodeV1(nodeID)?.ports ?? Realtime.Utils.port.createEmptyNodePorts() : Realtime.Utils.port.createEmptyNodePorts(),
    portsV2,
  ]
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
