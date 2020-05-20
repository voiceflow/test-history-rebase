import { BlockType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import { DBNode, NodeData } from '@/models';

import { createSimpleAdapter } from '../utils';
import blockAdapter, { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP } from './block';

const isSupportedBlockType = (type: BlockType) => Object.values(BlockType).includes(type);

const nodeDataAdapter = createSimpleAdapter<DBNode['extras'], NodeData<unknown>, [DBNode]>(
  (dbData, node) => {
    let type = APP_BLOCK_TYPE_FROM_DB[dbData.type] || dbData.type;

    if (!isSupportedBlockType(type)) {
      type = BlockType.DEPRECATED;
    }

    // EMERGENCY FIX - LOOK FOR ALTERNATE SOLUTION IN FUTURE
    try {
      if (dbData.type === BlockType.DEPRECATED) {
        if (Array.isArray(dbData.choices) && Array.isArray(dbData.inputs)) {
          type = BlockType.CHOICE_OLD;
        } else if (dbData.slot_type && dbData.slot_inputs) {
          type = BlockType.CAPTURE;
        } else if (Array.isArray(dbData.alexa?.choices) && Array.isArray(dbData.google?.choices)) {
          type = BlockType.CHOICE;
        } else if (Array.isArray(dbData.dialogs) && typeof dbData.randomize === 'boolean') {
          type = BlockType.SPEAK;
        } else if (typeof dbData.selected_integration === 'string' && typeof dbData.integrations_data === 'object') {
          type = BlockType.INTEGRATION;
        }
      }
    } catch (err) {
      console.error(err);
    }
    // END EMERGENCY FIX

    let data: Partial<NodeData<unknown>> = {};
    try {
      const fromDb = blockAdapter[type].fromDB;
      data = blockAdapter[type].fromDB(dbData as Parameters<typeof fromDb>[0]);
    } catch (err) {
      console.error('Block Adapter Error', err);
      data = dbData as any;
      data.deprecatedType = dbData.type;
      type = BlockType.DEPRECATED;
    }

    return {
      ...data,
      type,
      name: node.name,
      nodeID: node.id,
      path: [],
      // blockColor cannot be null as it is being used as a 'variant' in NewBlockContainer
      // for blocks with only one step, it will break the app
      blockColor: dbData.color || BlockVariant.STANDARD,
    };
  },
  ({ path, name, ...appData }) => ({
    ...blockAdapter[appData.type].toDB(appData),
    type: DB_BLOCK_TYPE_FROM_APP[appData.type] || appData.type,
    color: appData.blockColor || null,
  })
);

export default nodeDataAdapter;
