import { DiagramNode } from '@voiceflow/api-sdk';
import _isFunction from 'lodash/isFunction';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import blockAdapter, { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';

const nodeDataAdapter = createSimpleAdapter<
  { data: DiagramNode['data']; type: string },
  NodeData<unknown>,
  [{ platform: PlatformType; nodeID: string }],
  [{ platform: PlatformType }]
>(
  ({ data: dbData, type: dbType }, { platform, nodeID }) => {
    const getNodeType = APP_BLOCK_TYPE_FROM_DB[dbType];

    const type = _isFunction(getNodeType) ? getNodeType(dbData) : getNodeType || dbType;

    let data: Partial<NodeData<unknown>> = {};
    try {
      data = blockAdapter[type]?.fromDB(dbData as any, { platform }) || { deprecatedType: type, ...dbData };
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
  ({ type, path, deprecatedType, nodeID, ...appData }, { platform }) => {
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[type];
    const dbType = _isFunction(getNodeType) ? getNodeType(appData) : getNodeType || deprecatedType || type;

    let data: DiagramNode['data'] = {};
    try {
      data = blockAdapter[dbType as BlockType]?.toDB(appData as any, { platform }) || (appData as any);
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
