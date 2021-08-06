export interface APIKey {
  _id: string;
  workspaceID: string;
  creatorID: number;
  name: string;
  permissions: string[];
  scopes: string[];
  data?: any;
}
