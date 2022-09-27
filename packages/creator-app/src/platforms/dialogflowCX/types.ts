export type AgentName = `projects/${string}/locations/${string}/agents/${string}`;

export interface GCPAgent {
  name: AgentName;
  displayName: string;
}
