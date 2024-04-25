import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import {
  AssistantClient,
  BackupClient,
  BillingInvoiceClient,
  BillingPlanClient,
  BillingSubscriptionClient,
  EnvironmentClient,
  FunctionClient,
  KnowledgeBaseDocumentClient,
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
  upload: UploadClient,
  project: ProjectClient,
  function: FunctionClient,
  assistant: AssistantClient,
  environment: EnvironmentClient,
  organization: OrganizationClient,

  billing: NestedClient({
    plan: BillingPlanClient,
    invoice: BillingInvoiceClient,
    subscription: BillingSubscriptionClient,
  }),

  knowledgeBase: NestedClient({
    document: KnowledgeBaseDocumentClient,
  }),

  private: NestedClient({
    project: PrivateProjectClient,
    assistant: PrivateAssistantClient,
    environment: PrivateEnvironmentClient,
    prototypeProgram: PrivatePrototypeProgramClient,
  }),
}) {}
