/* eslint-disable no-underscore-dangle */
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorV1Selectors from '@/ducks/creator/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createCurriedSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { createEmptyNodePorts } from '../utils';
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
  nodeID ? portsByNodeID[nodeID] ?? createEmptyNodePorts() : createEmptyNodePorts()
);
export const portsByNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.nodeByIDSelector, _portsByNodeIDSelector, idParamSelector],
  (getNodeV1, portsV2, nodeID) => [nodeID ? getNodeV1(nodeID)?.ports ?? createEmptyNodePorts() : createEmptyNodePorts(), portsV2]
);
