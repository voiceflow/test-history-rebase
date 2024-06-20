/* eslint-disable no-param-reassign */
import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';
/**
 * this migration adds root diagram into topics, for some reason previous migration skipped it
 */
const migrateToV3_1: Transform = ({ version, diagrams }) => {
  // if we have topic for root diagram id, do nothing
  if (
    !!version.topics?.length &&
    version.topics.some((item) => String(item.sourceID) === String(version.rootDiagramID))
  )
    return;

  const rootDiagramItem = version.components?.find((item) => String(item.sourceID) === String(version.rootDiagramID));

  if (!rootDiagramItem) return;

  diagrams.forEach((diagram) => {
    const isRoot = String(diagram.diagramID) === String(version.rootDiagramID);

    diagram.type = isRoot
      ? BaseModels.Diagram.DiagramType.TOPIC
      : diagram.type ?? BaseModels.Diagram.DiagramType.COMPONENT;
  });

  version.topics = [rootDiagramItem, ...(version.topics ?? [])];
  version.components =
    version.components?.filter((item) => String(item.sourceID) !== String(version.rootDiagramID)) ?? [];
};

export default migrateToV3_1;
