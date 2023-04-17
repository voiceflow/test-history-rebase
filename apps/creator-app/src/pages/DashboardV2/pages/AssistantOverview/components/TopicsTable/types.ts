export interface Topic {
  id: string;
  name: string;
  intents: Array<{ name: string; nodeID: string; diagramID: string }>;
  domainID: string;
}
