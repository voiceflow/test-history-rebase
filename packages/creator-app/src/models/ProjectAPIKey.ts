export interface ProjectAPIKey {
  _id: string;
  key: string;
  projectID: string;
  creatorID: number;
  data?: unknown;
  secondaryKeyID?: string;
}
