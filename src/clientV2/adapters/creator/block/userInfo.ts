import type { StepData, UserInfo } from '@voiceflow/alexa-types/build/nodes/userInfo';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const useInfoPermissionAdapter = createAdapter<UserInfo, NodeData.UserInfoPermission>(
  ({ type, mapTo, product }) => ({ id: cuid.slug(), mapTo, product, selected: type }),
  ({ selected, mapTo, product }) => ({ type: selected, mapTo, product })
);

const userInfoAdapter = createBlockAdapter<StepData, NodeData.UserInfo>(
  ({ infos }) => ({ permissions: useInfoPermissionAdapter.mapFromDB(infos) }),
  ({ permissions }) => ({ infos: useInfoPermissionAdapter.mapToDB(permissions) })
);

export default userInfoAdapter;
