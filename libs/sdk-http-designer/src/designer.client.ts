import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import {
  AssistantClient,
  BackupClient,
  FunctionClient,
  PrivateAssistantClient,
  PrivateEnvironmentClient,
  PrivateProjectClient,
  PrivatePrototypeProgramClient,
  ProjectClient,
  UploadClient,
} from './generated';

export class DesignerClient extends BaseClient('https://realtime-api.voiceflow.com')({
  backup: BackupClient,
  project: ProjectClient,
  function: FunctionClient,
  assistant: AssistantClient,
  private: NestedClient({
    project: PrivateProjectClient,
    assistant: PrivateAssistantClient,
    environment: PrivateEnvironmentClient,
    prototypeProgram: PrivatePrototypeProgramClient,
  }),
  upload: UploadClient,
}) {}
