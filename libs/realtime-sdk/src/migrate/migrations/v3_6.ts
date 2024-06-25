/* eslint-disable no-param-reassign */
import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { Draft } from 'immer';

import type { Transform } from './types';

const findStartNode = (nodes: Draft<Record<string, BaseModels.BaseDiagramNode>>) =>
  Object.values(nodes).find(BaseUtils.step.isStart);
const findAllComponentsNodes = (nodes: Draft<Record<string, BaseModels.BaseDiagramNode>>) =>
  Object.values(nodes).filter(BaseUtils.step.isComponent);

/**
 * renames intentStepIDs into menuNodeIDs and adds components and start nodes into it
 */
const migrateToV3_6: Transform = ({ diagrams }) => {
  diagrams.forEach((dbDiagram) => {
    if (dbDiagram.type !== BaseModels.Diagram.DiagramType.TOPIC) return;

    dbDiagram.menuNodeIDs = [...(dbDiagram.intentStepIDs ?? [])];

    const startNode = findStartNode(dbDiagram.nodes);
    const componentsNodes = findAllComponentsNodes(dbDiagram.nodes);

    if (startNode) {
      dbDiagram.menuNodeIDs.unshift(startNode.nodeID);
    }

    if (componentsNodes.length) {
      dbDiagram.menuNodeIDs.push(...componentsNodes.map(({ nodeID }) => nodeID));
    }

    dbDiagram.menuNodeIDs = Utils.array.unique(dbDiagram.menuNodeIDs);
  });
};

export default migrateToV3_6;
