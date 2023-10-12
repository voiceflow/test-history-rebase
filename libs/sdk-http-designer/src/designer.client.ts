import { BaseClient } from '@voiceflow/sdk-common';

import { UploadClient } from './generated';

export class DesignerClient extends BaseClient('https://realtime.voiceflow.com')({
  upload: UploadClient,
}) {}
