import { DiagramNode } from '@voiceflow/api-sdk';
import _isFunction from 'lodash/isFunction';

import { createSimpleAdapter } from '@/client/adapters/utils';
import { BlockType, PlatformType } from '@/constants';
import { NodeData } from '@/models';

import blockAdapter, { APP_BLOCK_TYPE_FROM_DB } from './block';
import { creatorLogger, isSupportedBlockType } from './utils';

const log = creatorLogger.child('node-data');

const nodeDataAdapter = createSimpleAdapter<
  DiagramNode['data'],
  NodeData<unknown>,
  [{ dbNode: DiagramNode; platform: PlatformType }],
  [{ platform: PlatformType }]
>(
  (dbData, { dbNode, platform }) => {
    const getNodeType = APP_BLOCK_TYPE_FROM_DB[dbNode.type];

    let type = _isFunction(getNodeType) ? getNodeType(dbData) : getNodeType || dbNode.type;

    if (!isSupportedBlockType(type)) {
      type = BlockType.DEPRECATED;
    }

    let data: Partial<NodeData<unknown>> = {};

    try {
      data = blockAdapter[type].fromDB(dbData as any, { platform });
    } catch (err) {
      log.error('Block Adapter Error', err);
      data = dbData as any;
      data.deprecatedType = dbNode.type;
      type = BlockType.DEPRECATED;
    }

    return {
      name: '',
      ...data,
      type,
      nodeID: dbNode.nodeID,
      path: [],
    };
  },
  ({ type, path, ...appData }, { platform }) => blockAdapter[type].toDB(appData as any, { platform })
);

export default nodeDataAdapter;
