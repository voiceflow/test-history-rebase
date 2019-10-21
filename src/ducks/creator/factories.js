export const linkFactory = (sourcePort, targetPort, linkID) => ({
  id: linkID,
  points: [],
  source: { nodeID: sourcePort.nodeID, portID: sourcePort.id },
  target: { nodeID: targetPort.nodeID, portID: targetPort.id },
});

export const portFactory = (nodeID, portID, port) => ({
  label: null,
  ...port,
  id: portID,
  nodeID,
});
