import cuid from 'cuid';

import nodeAdapter from '@/client/adapters/creator/node';
import nodeDataAdapter from '@/client/adapters/creator/nodeData';
import { BlockType, STEP_NODES } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import { EntityMap, Node } from '@/models';
import { getManager } from '@/pages/Canvas/managers';
import { Pair } from '@/types';
import { objectID } from '@/utils';
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
    const newNodeID = objectID();

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
    const clonedEntityMap = await cloneEntityMap(entityMap);

    // single step
    if (clonedEntityMap.nodesWithData.length === 1 && STEP_NODES.includes(clonedEntityMap.nodesWithData[0].node.type)) {
      const originalNode = entityMap.nodesWithData[0].node;
      const nodeToCopy = clonedEntityMap.nodesWithData[0].node;

      const parentNode = this.engine.getNodeByID(originalNode.parentNode!);

      let canBeAdded = true;
      const index = parentNode.combinedNodes.indexOf(originalNode.id) + 1;

      // nodes with that have mergeTerminator: true cannot have any steps after them
      const allNodesBefore = parentNode.combinedNodes.slice(0, index);
      allNodesBefore.forEach((nodeID: string) => {
        const node: Node = this.engine.getNodeByID(nodeID);
        const config = getManager(node.type);
        if (config.mergeTerminator || config.mergeInitializer) {
          canBeAdded = false;
        }
      });

      // nodes that have no in ports (intent) cannot have steps before it
      const allNodesAfter = parentNode.combinedNodes.slice(index);
      allNodesAfter.forEach((nodeID: string) => {
        const node: Node = this.engine.getNodeByID(nodeID);
        if (node.type === BlockType.INTENT) {
          canBeAdded = false;
        }
      });

      // if a step can be added to the block, add it
      if (canBeAdded) {
        await this.engine.node.addNestedV2({
          type: nodeToCopy.type,
          index,
          nodeID: cuid(),
          position: this.engine.getCanvasMousePosition(),
          factoryData: entityMap.nodesWithData[0].data,
          parentNodeID: originalNode.parentNode!,
        });
      }
      // if a step cannot be added to the block, create a new block
      else {
        await this.engine.node.add(nodeToCopy.type, coords, clonedEntityMap.nodesWithData[0].data, nodeToCopy.id);
      }
    } else {
      await this.engine.node.addMany(clonedEntityMap, coords);
    }

    return clonedEntityMap;
  }

  duplicateParentNode(node: Node) {
    const isStep = STEP_NODES.includes(node.type);
    const parentNode = this.engine.getNodeByID(node.parentNode!);
    const coords = this.engine.canvas!.toCoords([parentNode.x, parentNode.y]).add(DUPLICATE_OFFSET);
    if (!isStep) {
      const nodeOverrides = {
        parentNode: null,
        x: parentNode.x,
        y: parentNode.y,
        combinedNodes: [node.id],
      };

      const entities = this.getParentEntities(node.parentNode!, true, nodeOverrides);
      const childEntities = this.getEntities(node.id, false);
      const mergedEntities = mergeEntityMaps(entities, childEntities);

      return this.cloneEntities(mergedEntities, coords);
    }
    const state = this.engine.store.getState();
    const creator = Creator.creatorDiagramSelector(state);
    const targetPlatform = Skill.activePlatformSelector(state);
    const dbNode = nodeAdapter.toDB(node, {
      nodes: creator.nodes,
      ports: creator.ports,
      data: creator.data,
      linksByPortID: creator.linksByPortID,
      platform: targetPlatform,
    });
    const nodeData = nodeDataAdapter.fromDB(dbNode.extras, dbNode);
    const nodesWithData: EntityMap = {
      nodesWithData: [
        {
          data: nodeData,
          node,
        },
      ],
      ports: [],
      links: [],
    };
    return this.cloneEntities(nodesWithData, coords);
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

    if (rootNode.type === BlockType.START) {
      return null;
    }

    const {
      nodesWithData: [nodeWithData],
    } = await (rootNode.parentNode ? this.duplicateParentNode(rootNode) : this.duplicateChildNode(rootNode));

    return nodeWithData?.node?.id;
  }
}

export default DiagramEngine;
