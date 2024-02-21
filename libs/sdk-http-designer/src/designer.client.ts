import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import {
  AssistantClient,
  BackupClient,
  BillingClient,
  BillingInvoiceClient,
  BillingSubscriptionClient,
  FunctionClient,
  OrganizationClient,
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
  organization: OrganizationClient,
  billing: NestedClient({
    subscription: BillingSubscriptionClient,
    invoice: BillingInvoiceClient,
    billing: BillingClient,
  }),
  private: NestedClient({
    project: PrivateProjectClient,
    assistant: PrivateAssistantClient,
    environment: PrivateEnvironmentClient,
    prototypeProgram: PrivatePrototypeProgramClient,
  }),
  upload: UploadClient,
}) {}
