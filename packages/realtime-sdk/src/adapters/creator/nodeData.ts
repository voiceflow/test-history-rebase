import { BlockType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { Models as BaseModels } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { createSimpleAdapter } from 'bidirectional-adapter';

import { AdapterContext } from '../types';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP, getBlockAdapter } from './block';
import { needsMigration } from './utils';

const nodeDataAdapter = createSimpleAdapter<
  { data: BaseModels.BaseDiagramNode['data']; type: string },
  NodeData<unknown>,
  [{ platform: Constants.PlatformType; nodeID: string; context: AdapterContext }],
  [{ platform: Constants.PlatformType; context: AdapterContext }]
>(
  ({ data: dbData, type: dbType }, { platform, nodeID, context }) => {
    const getNodeType = APP_BLOCK_TYPE_FROM_DB[dbType];

    const type = typeof getNodeType === 'function' ? getNodeType(dbData, { context }) : getNodeType || dbType;

    let data: Partial<NodeData<unknown>> = {};

    try {
      const adapters = getBlockAdapter(platform, needsMigration(dbType, type));

      data = adapters[type]?.fromDB(dbData, { context }) || { deprecatedType: type, ...dbData };
    } catch {
      data = { deprecatedType: type, ...dbData };
    }

    return {
      name: '',
      ...data,
      type: data.deprecatedType ? BlockType.DEPRECATED : type,
      nodeID,
      path: [],
    };
  },
  ({ type, path, deprecatedType, nodeID, ...appData }, { platform, context }) => {
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[type];
    const dbType = typeof getNodeType === 'function' ? getNodeType(appData, { context }) : getNodeType || deprecatedType || type;

    let data: BaseModels.BaseDiagramNode['data'] = {};

    try {
      const adapters = getBlockAdapter(platform);

      data = adapters[type]?.toDB(appData as any, { context }) || (appData as any);
    } catch {
      data = appData as any;
    }

    return {
      data,
      type: dbType,
    };
  }
);

export default nodeDataAdapter;
