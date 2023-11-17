import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import { PrivateEnvironmentClient, PrivateProjectClient, ProjectClient, UploadClient } from './generated';

export class DesignerClient extends BaseClient('https://realtime-api.voiceflow.com')({
  upload: UploadClient,
  project: ProjectClient,

  private: NestedClient({
    environment: PrivateEnvironmentClient,
    project: PrivateProjectClient,
  }),
}) {}
