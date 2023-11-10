import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import { PrivateEnvironmentClient, ProjectClient, UploadClient } from './generated';

export class DesignerClient extends BaseClient('https://realtime.voiceflow.com')({
  upload: UploadClient,
  project: ProjectClient,

  private: NestedClient({
    environment: PrivateEnvironmentClient,
  }),
}) {}
