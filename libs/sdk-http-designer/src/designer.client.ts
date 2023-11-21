import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import {
  AssistantClient,
  PrivateAssistantClient,
  PrivateEnvironmentClient,
  PrivateProjectClient,
  ProjectClient,
  UploadClient,
} from './generated';

export class DesignerClient extends BaseClient('https://realtime-api.voiceflow.com')({
  upload: UploadClient,
  project: ProjectClient,
  assistant: AssistantClient,

  private: NestedClient({
    project: PrivateProjectClient,
    assistant: PrivateAssistantClient,
    environment: PrivateEnvironmentClient,
  }),
}) {}
