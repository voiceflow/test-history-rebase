import cuid from 'cuid';

import { BlockType } from '@/constants';
import { activeSkillIDSelector } from '@/ducks/skill';
import { EntityMap, Node } from '@/models';
import { Pair } from '@/types';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, cloneEntityMap, mergeEntityMaps } from './utils';

const DUPLICATE_OFFSET: Pair<number> = [40, 40];

class DiagramEngine extends EngineConsumer {
  getEntities(nodeID: string, rename = true, nodeOverrides = {}): EntityMap {
    const node = this.engine.getNodeByID(nodeID);
    const data = this.engine.getDataByNodeID(nodeID);

    return {
      nodesWithData: [{ node: { ...node, ...nodeOverrides }, data: rename ? { ...data, name: `${data.name} copy` } : data }],
      ports: [...node.ports.in, ...node.ports.out].map(this.engine.getPortByID),
      links: [],
    };
  }

  getParentEntities(nodeID: string, rename = true, nodeOverrides = {}): EntityMap {
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

  getChildEntities(nodeID: string): EntityMap {
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

  async cloneEntities(entityMap: EntityMap, coords: Coords) {
    const state = this.engine.store.getState();
    const skillID = activeSkillIDSelector(state);
    const clonedEntityMap = await cloneEntityMap(entityMap, this.engine.store.dispatch, skillID);
    await this.engine.node.addMany(clonedEntityMap, coords);

    return clonedEntityMap;
  }

  duplicateParentNode(node: Node) {
    const parentNode = this.engine.getNodeByID(node.parentNode!);
    const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [node.id] };

    const entities = this.getParentEntities(node.parentNode!, true, nodeOverrides);
    const childEntities = this.getEntities(node.id, false);
    const mergedEntities = mergeEntityMaps(entities, childEntities);

    const coords = this.engine.canvas!.toCoords([parentNode.x, parentNode.y]).add(DUPLICATE_OFFSET);

    return this.cloneEntities(mergedEntities, coords);
  }

  duplicateChildNode(node: Node) {
    const entities = this.getEntities(node.id, true);
    const childEntities = this.getChildEntities(node.id);
    const mergedEntities = mergeEntityMaps(entities, childEntities);

    const coords = this.engine.canvas!.toCoords([node.x, node.y]).add(DUPLICATE_OFFSET);

    return this.cloneEntities(mergedEntities, coords);
  }

  async duplicateNode(nodeID: string) {
    const rootNode = this.engine.getNodeByID(nodeID);

    const {
      nodesWithData: [nodeWithData],
    } = await (rootNode.parentNode ? this.duplicateParentNode(rootNode) : this.duplicateChildNode(rootNode));

    return nodeWithData?.node?.id;
  }
}

export default DiagramEngine;
