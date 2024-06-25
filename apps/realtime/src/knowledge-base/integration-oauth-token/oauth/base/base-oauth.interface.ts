import type { KnowledgeBaseDocumentRefreshRate } from '@voiceflow/dtos';

interface OauthService {
  uploadDocsByFilters({
    projectID,
    creatorID,
    integrationTokenID,
    accessToken,
    filters,
    refreshRate,
  }: {
    projectID: string;
    creatorID: number;
    integrationTokenID: number;
    accessToken: string;
    filters?: object;
    refreshRate?: KnowledgeBaseDocumentRefreshRate;
  }): Promise<void>;
}

export default OauthService;
