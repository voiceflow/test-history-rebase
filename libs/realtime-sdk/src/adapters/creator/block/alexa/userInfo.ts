import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const useInfoPermissionAdapter = createMultiAdapter<AlexaNode.UserInfo.UserInfo, NodeData.UserInfoPermission>(
  ({ type, mapTo, product }) => ({ id: Utils.id.cuid.slug(), mapTo, product, selected: type }),
  ({ selected, mapTo, product }) => ({ type: selected, mapTo, product })
);

const userInfoAdapter = createBlockAdapter<AlexaNode.UserInfo.StepData, NodeData.UserInfo>(
  ({ infos }) => ({ permissions: useInfoPermissionAdapter.mapFromDB(infos) }),
  ({ permissions }) => ({ infos: useInfoPermissionAdapter.mapToDB(permissions) })
);

export const userInfoOutPortAdapter = createOutPortsAdapter<NodeData.UserInfoBuiltInPorts, NodeData.UserInfo>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const userInfoOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.UserInfoBuiltInPorts, NodeData.UserInfo>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default userInfoAdapter;
