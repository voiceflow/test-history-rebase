import { BaseModels } from '@voiceflow/base-types';

import { Transform } from './types';

/**
 * this migration fix an issue if there're multiple templates diagrams in the same version
 */
const migrateToV3_91: Transform = ({ version, diagrams }) => {
  if (!version.templateDiagramID) return;

  const templateDiagrams = diagrams.filter((diagram) => diagram.type === BaseModels.Diagram.DiagramType.TEMPLATE);

  if (templateDiagrams.length <= 1) return;

  const templateDiagram =
    templateDiagrams.find((diagram) => diagram.diagramID === version.templateDiagramID) ?? templateDiagrams[0];
  const templateDiagramsToMerge = templateDiagrams.filter((diagram) => diagram.diagramID !== templateDiagram.diagramID);

  templateDiagramsToMerge.forEach((diagram) => {
    templateDiagram.nodes = {
      ...diagram.nodes,
      ...templateDiagram.nodes,
    };
  });

  // eslint-disable-next-line no-param-reassign
  version.templateDiagramID = templateDiagram.diagramID;
};

export default migrateToV3_91;
