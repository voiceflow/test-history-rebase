import { BaseModels, BaseNode } from '@voiceflow/base-types';

const CENTER_OFFSET_MULTIPLIER = 0.8;
const CENTER_X_OFFSET = 700;
const CENTER_Y_OFFSET = 200;

export const getCenteredDiagramPosition = (diagramNodes: Record<string, BaseModels.BaseDiagramNode>): Array<number> => {
  const startNode = Object.entries(diagramNodes || {})
    .flatMap(([, nodes]) => nodes)
    .find((node) => node.type === BaseNode.NodeType.START);

  if (!startNode?.coords?.length) return [0, 0];

  return [(CENTER_X_OFFSET - startNode.coords![0]) * CENTER_OFFSET_MULTIPLIER, CENTER_Y_OFFSET - startNode.coords![1] * CENTER_OFFSET_MULTIPLIER];
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const centerDiagrams = (allDiagrams: Record<string, BaseModels.Diagram.Model>) => {
  const diagrams = Object.entries(allDiagrams).flatMap(([id, diagramData]) => ({ id, diagramData }));
  diagrams.forEach(({ id, diagramData }) => {
    const centeredPosition = getCenteredDiagramPosition(diagramData.nodes);
    if (centeredPosition.length === 0) return;
    const [centeredPositionX, centeredPositionY] = centeredPosition;
    allDiagrams[id].offsetX = centeredPositionX;
    allDiagrams[id].offsetY = centeredPositionY;
  });
};
