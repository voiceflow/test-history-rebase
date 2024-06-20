/* eslint-disable no-param-reassign */
import * as Utils from '@realtime-sdk/utils';
import { BaseModels, BaseNode, BaseUtils } from '@voiceflow/base-types';
import { AnyRecord } from '@voiceflow/common';
import { Draft } from 'immer';

import type { DiagramUpdateData, VersionUpdateData } from './types';
import { Transform } from './types';

const createDiagramFolderItem = (diagram: Draft<DiagramUpdateData>) => ({
  type: BaseModels.Version.FolderItemType.DIAGRAM,
  sourceID: diagram.diagramID,
});

const addIntentStepIDs = (diagram: Draft<DiagramUpdateData>) => {
  diagram.intentStepIDs = [];

  Object.values(diagram.nodes).forEach((node) => {
    if (!Utils.typeGuards.isIntentDBNode(node)) return;

    diagram.intentStepIDs!.push(node.nodeID);
  });
};

const migrateToTopicsAndComponents = (version: Draft<VersionUpdateData>, diagrams: Draft<DiagramUpdateData[]>) => {
  version.topics = [];
  version.folders = {};
  version.components = [];

  diagrams.forEach((diagram) => {
    if (String(diagram.diagramID) === String(version.rootDiagramID)) {
      diagram.type = BaseModels.Diagram.DiagramType.TOPIC;
      version.topics!.push(createDiagramFolderItem(diagram));

      addIntentStepIDs(diagram);
    } else {
      diagram.type = BaseModels.Diagram.DiagramType.COMPONENT;
      version.components!.push(createDiagramFolderItem(diagram));
    }
  });
};

const syncTopicsAndComponents = (version: Draft<VersionUpdateData>, diagrams: Draft<DiagramUpdateData[]>) => {
  const topicsDiagrams = diagrams.filter((diagram) => diagram.type === BaseModels.Diagram.DiagramType.TOPIC);
  const componentsDiagrams = diagrams.filter(
    (diagram) => !diagram.type || diagram.type === BaseModels.Diagram.DiagramType.COMPONENT
  );

  version.topics = topicsDiagrams.map(createDiagramFolderItem);
  version.folders ??= {};
  version.components = componentsDiagrams.map(createDiagramFolderItem);

  topicsDiagrams.forEach(addIntentStepIDs);
};

function migrateFlowToComponent(dbNode: Draft<BaseModels.BaseDiagramNode<AnyRecord>>) {
  if (!BaseUtils.step.isFlow(dbNode)) return;

  const componentNode: BaseNode.Component.Step = {
    ...dbNode,
    type: BaseNode.NodeType.COMPONENT,
  };

  Object.assign(dbNode, componentNode);
}

/**
 * this migration adds topics and components to the project
 */
const migrateToV3_0: Transform = ({ version, diagrams }) => {
  // applying for all projects just to be sure we don't have any old nodes in the project
  diagrams.forEach((diagram) => Object.values(diagram.nodes).forEach(migrateFlowToComponent));

  if (!version.topics?.length) {
    migrateToTopicsAndComponents(version, diagrams);

    return;
  }

  const topicsDiagrams = diagrams.filter(
    (diagram) =>
      String(diagram.diagramID) === String(version.rootDiagramID) ||
      diagram.type === BaseModels.Diagram.DiagramType.TOPIC
  );
  const componentsDiagrams = diagrams.filter(
    (diagram) =>
      (!diagram.type || diagram.type === BaseModels.Diagram.DiagramType.COMPONENT) &&
      String(diagram.diagramID) !== String(version.rootDiagramID)
  );

  if (version.topics.length === topicsDiagrams.length && version.components?.length === componentsDiagrams.length)
    return;

  syncTopicsAndComponents(version, diagrams);
};

export default migrateToV3_0;
