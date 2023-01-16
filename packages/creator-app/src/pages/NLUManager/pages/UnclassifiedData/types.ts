export interface UnclassifiedDataCluster {
  id: string;
  name: string;
  utteranceIDs: string[];
}

export interface ClusteringMatch {
  intentID: string;
  intentMatchScore: number;
}
