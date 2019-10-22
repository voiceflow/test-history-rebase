import { BlockType } from '@/constants';

import { createSimpleAdapter } from '../utils';
import blockAdapter, { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';

const isSupportedBlockType = (type) => Object.values(BlockType).includes(type);

const nodeDataAdapter = createSimpleAdapter(
  (dbData, node) => {
    let type = APP_BLOCK_TYPE_FROM_DB[dbData.type] || dbData.type;

    if (!isSupportedBlockType(type)) {
      type = BlockType.DEPRECATED;
    }

    let data = {};
    try {
      data = blockAdapter[type].fromDB(dbData);
    } catch (err) {
      data = dbData;
      data.deprecatedType = type;
      type = BlockType.DEPRECATED;
    }

    return {
      ...data,
      type,
      name: node.name,
      nodeID: node.id,
    };
  },
  (appData) => ({
    ...blockAdapter[appData.type].toDB(appData),
    type: DB_BLOCK_TYPE_FROM_APP[appData.type] || appData.type,
  })
);

export default nodeDataAdapter;
