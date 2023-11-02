import { BaseClient } from '@voiceflow/sdk-common';

import { ProjectClient, UploadClient } from './generated';

export class DesignerClient extends BaseClient('https://realtime.voiceflow.com')({
  upload: UploadClient,
  project: ProjectClient,
}) {}
