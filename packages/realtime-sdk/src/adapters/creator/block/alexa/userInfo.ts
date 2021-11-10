import { Node } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import createAdapter from 'bidirectional-adapter';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const useInfoPermissionAdapter = createAdapter<Node.UserInfo.UserInfo, NodeData.UserInfoPermission>(
  ({ type, mapTo, product }) => ({ id: Utils.id.cuid.slug(), mapTo, product, selected: type }),
  ({ selected, mapTo, product }) => ({ type: selected, mapTo, product })
);

const userInfoAdapter = createBlockAdapter<Node.UserInfo.StepData, NodeData.UserInfo>(
  ({ infos }) => ({ permissions: useInfoPermissionAdapter.mapFromDB(infos) }),
  ({ permissions }) => ({ infos: useInfoPermissionAdapter.mapToDB(permissions) })
);

export default userInfoAdapter;
