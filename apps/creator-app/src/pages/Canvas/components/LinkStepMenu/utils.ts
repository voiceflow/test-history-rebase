import * as Realtime from '@voiceflow/realtime-sdk';

export const getSingleBlockTemplatePortID = (nodes: Realtime.NodeWithData[] | undefined) => {
  if (!nodes) return null;

  const combinedNodes = nodes.filter((node) => node.data.type === Realtime.BlockType.COMBINED);

  if (combinedNodes.length !== 1) return null;

  return combinedNodes[0].node.ports.in[0];
};
