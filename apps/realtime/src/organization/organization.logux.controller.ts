import { Controller } from '@nestjs/common';
import { Action, Channel } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Channels } from '@voiceflow/sdk-logux-designer';

import { InjectRequestContext } from '@/common';

@Controller()
@InjectRequestContext()
export class OrganizationLoguxController {
  @Channel(Channels.organization)
  @Authorize.Permissions<Channels.OrganizationParams>([Permission.ORGANIZATION_READ], ({ organizationID }) => ({
    id: organizationID,
    kind: 'organization',
  }))
  async subscribe() {
    // subscribe only. Organization channel is used only for authorization
  }

  @Action.Async(Realtime.organization.updateName)
  @Authorize.Permissions<Actions.Assistant.CreateOne.Request>([Permission.WORKSPACE_PROJECT_CREATE], ({ context }) => ({
    id: context.workspaceID,
    kind: 'workspace',
  }))
  @UseRequestContext()
  createOne(
    @Payload() { data, context }: Actions.Assistant.CreateOne.Request,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<Actions.Assistant.CreateOne.Response> {
    return this.service
      .createOneFromTemplateAndBroadcast(authMeta, { ...data, workspaceID: this.assistantSerializer.decodeWorkspaceID(context.workspaceID) })
      .then(({ project, assistant }) => ({
        data: { project: this.projectSerializer.nullable(project), assistant: this.assistantSerializer.nullable(assistant) },
        context: { workspaceID: context.workspaceID },
      }));
  }
}
