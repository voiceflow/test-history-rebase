import { BlockType } from '@/constants';
import { activeSkillIDSelector } from '@/ducks/skill';

import { EngineConsumer, cloneEntityMap, mergeEntityMaps } from './utils';

const DUPLICATE_OFFSET = 40;

class DiagramEngine extends EngineConsumer {
  getEntities(nodeID, rename = true, nodeOverrides = {}) {
    const node = this.engine.getNodeByID(nodeID);
    const data = this.engine.getDataByNodeID(nodeID);

    return {
      nodesWithData: [{ node: { ...node, ...nodeOverrides }, data: rename ? { ...data, name: `${data.name} copy` } : data }],
      ports: [...node.ports.in, ...node.ports.out].map(this.engine.getPortByID),
      links: [],
    };
  }

  getChildEntities(nodeID) {
    const node = this.engine.getNodeByID(nodeID);

    if (node.type !== BlockType.COMBINED) {
      return {
        nodesWithData: [],
        ports: [],
        links: [],
      };
    }

    return node.combinedNodes.map((childNodeID) => this.getEntities(childNodeID, false, { x: node.x, y: node.y })).reduce(mergeEntityMaps);
  }

  async cloneEntities(entityMap, position) {
    const state = this.engine.store.getState();
    const skillID = activeSkillIDSelector(state);
    const clonedEntityMap = await cloneEntityMap(entityMap, this.engine.store.dispatch, skillID);
    await this.engine.node.addMany(clonedEntityMap, position);

    return clonedEntityMap;
  }

  async duplicateNode(nodeID) {
    const rootNode = this.engine.getNodeByID(nodeID);

    let nodeOverrides = null;
    if (rootNode.parentNode) {
      const parentNode = this.engine.getNodeByID(nodeID);

      nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y };
    }

    const entities = this.getEntities(nodeID, true, nodeOverrides);
    const childEntities = this.getChildEntities(nodeID);

    const mergedEntities = mergeEntityMaps(entities, childEntities);
    const clonedEntities = await this.cloneEntities(mergedEntities, [rootNode.x + DUPLICATE_OFFSET, rootNode.y + DUPLICATE_OFFSET]);

    return clonedEntities.nodesWithData[0]?.node?.id;
  }
}

export default DiagramEngine;
