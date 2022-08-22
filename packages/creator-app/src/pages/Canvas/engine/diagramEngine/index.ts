import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { Coords } from '@/utils/geometry';

import { CloneContextOptions, cloneEntityMap, DUPLICATE_OFFSET, EngineConsumer, mergeEntityMaps } from '../utils';
import { childEntityMapSelector, entityMapSelector, parentEntityMapSelector } from './selectors';

class DiagramEngine extends EngineConsumer {
  private getEntities(nodeID: string, rename = true, nodeOverrides: Partial<Realtime.Node> = {}): Realtime.EntityMap {
    return this.select(entityMapSelector)(nodeID, rename, nodeOverrides);
  }

  getParentEntities(nodeID: string, rename = true, nodeOverrides: Partial<Realtime.Node> = {}): Realtime.EntityMap {
    return this.select(parentEntityMapSelector)(nodeID, rename, nodeOverrides);
  }

  private getChildEntities(nodeID: string): Realtime.EntityMap {
    return this.select(childEntityMapSelector)(nodeID);
  }

  async cloneEntities(entityMap: Realtime.EntityMap, coords: Coords, options?: CloneContextOptions): Promise<Realtime.EntityMap> {
    const clonedEntityMap = cloneEntityMap(entityMap, options);

    await this.engine.node.importSnapshot(clonedEntityMap, coords);

    return clonedEntityMap;
  }

  private async duplicateCommand(blockID: string, commandStepID: string): Promise<Realtime.EntityMap> {
    const parentNode = this.engine.getNodeByID(blockID)!;
    const entities = this.getEntities(commandStepID, true);
    const clonedEntities = cloneEntityMap(entities, { nodeIDLookup: { [blockID]: blockID } });
    const {
      nodesWithData: [{ node, data }],
    } = clonedEntities;

    const stepIDs = parentNode.combinedNodes;
    const targetIndex = stepIDs.includes(node.id) ? stepIDs.indexOf(node.id) + 1 : stepIDs.length;

    await this.engine.node.insertStep(blockID, node.type, targetIndex, { nodeID: node.id, factoryData: data });

    return clonedEntities;
  }

  private duplicateAsBlock(node: Realtime.Node): Promise<Realtime.EntityMap> {
    const parentNode = this.engine.getNodeByID(node.parentNode)!;
    const nodeOverrides = { parentNode: null, x: parentNode.x, y: parentNode.y, combinedNodes: [node.id] };

    const entities = this.getParentEntities(node.parentNode!, true, nodeOverrides);

    const newBlockID = entities.nodesWithData[0].node.id;

    const childEntities = this.getEntities(node.id, false, { parentNode: newBlockID });

    // make sure childEntites is passed as the lhs to ensure the
    // downstream auto-focus targets the step rather than the block
    const mergedEntities = mergeEntityMaps(childEntities, entities);

    const coords = this.engine.canvas!.toCoords([parentNode.x, parentNode.y]).add(DUPLICATE_OFFSET);

    return this.cloneEntities(mergedEntities, coords);
  }

  private duplicateRootNode(node: Realtime.Node): Promise<Realtime.EntityMap> {
    const entities = this.getEntities(node.id, true);
    const childEntities = this.getChildEntities(node.id);
    const mergedEntities = mergeEntityMaps(entities, childEntities);

    const coords = this.engine.canvas!.toCoords([node.x, node.y]).add(DUPLICATE_OFFSET);

    return this.cloneEntities(mergedEntities, coords);
  }

  async duplicateNode(nodeID: string): Promise<Nullable<Realtime.NodeWithData>> {
    const node = this.engine.getNodeByID(nodeID)!;

    if (node.type === BlockType.START) {
      return null;
    }

    let duplicatedEntities: Realtime.EntityMap;

    if (node.parentNode && node.type === BlockType.COMMAND) {
      duplicatedEntities = await this.duplicateCommand(node.parentNode, node.id);
    } else if (node.parentNode) {
      duplicatedEntities = await this.duplicateAsBlock(node);
    } else {
      duplicatedEntities = await this.duplicateRootNode(node);
    }

    const {
      nodesWithData: [nodeWithData],
    } = duplicatedEntities;

    return nodeWithData;
  }
}

export default DiagramEngine;
