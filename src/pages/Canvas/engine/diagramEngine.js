import cuid from 'cuid';

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

  getParentEntities(nodeID, rename = true, nodeOverrides = {}) {
    const node = this.engine.getNodeByID(nodeID);
    const data = this.engine.getDataByNodeID(nodeID);
    const newNodeID = cuid();

    return {
      nodesWithData: [
        {
          node: {
            ...node,
            ...nodeOverrides,
            id: newNodeID,
          },
          data: {
            ...data,
            name: rename ? `${data.name} copy` : data.name,
            nodeID: newNodeID,
          },
        },
      ],
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
    let entities = null;
    let childEntities = null;
    let newPosition = [];

    if (rootNode.parentNode) {
      // to handle the case of duplicating Step in block redesign
      if (this.engine.isBlockRedesignEnabled()) {
        const parentNode = this.engine.getNodeByID(rootNode.parentNode);
        const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [nodeID] };

        entities = this.getParentEntities(rootNode.parentNode, true, nodeOverrides);
        childEntities = this.getEntities(nodeID, false);

        newPosition = [parentNode.x + DUPLICATE_OFFSET, parentNode.y + DUPLICATE_OFFSET];
      } else {
        // to handle the case of duplicating nested block in older version
        const parentNode = this.engine.getNodeByID(nodeID);
        const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y };

        entities = this.getEntities(nodeID, true, nodeOverrides);
        childEntities = this.getChildEntities(nodeID);
        newPosition = [rootNode.x + DUPLICATE_OFFSET, rootNode.y + DUPLICATE_OFFSET];
      }
    } else {
      // to handle all the other cases
      entities = this.getEntities(nodeID, true, null);
      childEntities = this.getChildEntities(nodeID);
      newPosition = [rootNode.x + DUPLICATE_OFFSET, rootNode.y + DUPLICATE_OFFSET];
    }

    const mergedEntities = mergeEntityMaps(entities, childEntities);
    const clonedEntities = await this.cloneEntities(mergedEntities, newPosition);

    return clonedEntities.nodesWithData[0]?.node?.id;
  }
}

export default DiagramEngine;
