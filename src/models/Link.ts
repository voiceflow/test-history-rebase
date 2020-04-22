export type Link = {
  id: string;
  source: {
    nodeID: string;
    portID: string;
  };
  target: {
    nodeID: string;
    portID: string;
  };
};

export type DBLink = {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  virtual?: {
    nodeID: string;
    portID: string;
  };
};
