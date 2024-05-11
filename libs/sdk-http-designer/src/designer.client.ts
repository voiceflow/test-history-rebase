import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import {
  AssistantClient,
  BackupClient,
  BillingInvoiceClient,
  BillingPlanClient,
  BillingSubscriptionClient,
  EnvironmentClient,
  FunctionClient,
  KbpublicApiDocumentClient,
  KnowledgeBaseDocumentClient,
  KnowledgeBaseIntegrationsClient,
  KnowledgeBaseSettingsClient,
  KnowledgeBaseTagClient,
  OrganizationClient,
  PrivateAssistantClient,
  PrivateEnvironmentClient,
  PrivateProjectClient,
  PrivatePrototypeProgramClient,
  ProjectClient,
  UploadClient,
  VersionKnowledgeBaseSettingsClient,
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
    public: KbpublicApiDocumentClient,
    document: KnowledgeBaseDocumentClient,
    integration: KnowledgeBaseIntegrationsClient,
    settings: KnowledgeBaseSettingsClient,
    version: VersionKnowledgeBaseSettingsClient,
    tag: KnowledgeBaseTagClient,
  }),

  private: NestedClient({
    project: PrivateProjectClient,
    assistant: PrivateAssistantClient,
    environment: PrivateEnvironmentClient,
    prototypeProgram: PrivatePrototypeProgramClient,
  }),
}) {}
