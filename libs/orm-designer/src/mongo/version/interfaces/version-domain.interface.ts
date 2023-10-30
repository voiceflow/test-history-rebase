export interface VersionDomain {
  id: string;
  name: string;
  live: boolean;
  status?: string;
  topicIDs: string[];
  updatedBy?: number;
  updatedAt?: Date;
  rootDiagramID: string;

  /**
   * @deprecated in favor of updatedBy
   * */
  updatedByCreatorID?: number;
}
