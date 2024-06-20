import { Inject } from '@nestjs/common';
import { AuthMeta, AuthMetaPayload, Payload } from '@voiceflow/nestjs-logux';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { Action, LoguxController } from '@/common';

import { FlowService } from './flow.service';

@LoguxController()
export class FlowLoguxController {
  constructor(
    @Inject(FlowService)
    private readonly service: FlowService
  ) {}

  @Action.Assistant.Update(Actions.Flow.CreateOne)
  createOne(
    @Payload() { data, context }: Actions.Flow.CreateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Flow.CreateOne.Response> {
    return this.service
      .createManyAndBroadcast([data], { auth, context })
      .then(([result]) => ({ data: this.service.toJSON(result), context }));
  }

  @Action.Assistant.Update(Actions.Flow.CreateMany)
  async createMany(
    @Payload() { data, context }: Actions.Flow.CreateMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Flow.CreateMany.Response> {
    return this.service
      .createManyAndBroadcast(data, { auth, context })
      .then((results) => ({ data: this.service.mapToJSON(results), context }));
  }

  @Action.Assistant.Update(Actions.Flow.DuplicateOne)
  async duplicateOne(
    @Payload() { data, context }: Actions.Flow.DuplicateOne.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Flow.DuplicateOne.Response> {
    return this.service.duplicateOneAndBroadcast(data, { auth, context }).then((result) => ({
      data: this.service.toJSON(result),
      context,
    }));
  }

  @Action.Assistant.Update(Actions.Flow.CopyPasteMany)
  async copyPasteMany(
    @Payload() { data, context }: Actions.Flow.CopyPasteMany.Request,
    @AuthMeta() auth: AuthMetaPayload
  ): Promise<Actions.Flow.CopyPasteMany.Response> {
    return this.service.copyPasteManyAndBroadcast(data, { auth, context }).then((result) => ({
      data: this.service.mapToJSON(result),
      context,
    }));
  }

  @Action.Assistant.Update(Actions.Flow.PatchOne)
  async patchOne(@Payload() { id, patch, context }: Actions.Flow.PatchOne, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchOneForUser(auth.userID, { id, environmentID: context.environmentID }, patch);
  }

  @Action.Assistant.Update(Actions.Flow.PatchMany)
  async patchMany(@Payload() { ids, patch, context }: Actions.Flow.PatchMany, @AuthMeta() auth: AuthMetaPayload) {
    await this.service.patchManyForUser(
      auth.userID,
      ids.map((id) => ({ id, environmentID: context.environmentID })),
      patch
    );
  }

  @Action.Assistant.Update(Actions.Flow.DeleteOne)
  async deleteOne(@Payload() { id, context }: Actions.Flow.DeleteOne, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync([id], { userID: auth.userID, context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, flows: [] } }, { auth, context });
  }

  @Action.Assistant.Update(Actions.Flow.DeleteMany)
  async deleteMany(@Payload() { ids, context }: Actions.Flow.DeleteMany, @AuthMeta() auth: AuthMetaPayload) {
    const result = await this.service.deleteManyAndSync(ids, { userID: auth.userID, context });

    // overriding entities cause it's broadcasted by decorator
    await this.service.broadcastDeleteMany({ ...result, delete: { ...result.delete, flows: [] } }, { auth, context });
  }

  @Action.Assistant.Update(Actions.Flow.AddOne, { requestContext: false })
  async addOne(@Payload() _: Actions.Flow.AddOne) {
    // for broadcast only
  }

  @Action.Assistant.Update(Actions.Flow.AddMany, { requestContext: false })
  async addMany(@Payload() _: Actions.Flow.AddMany) {
    // for broadcast only
  }
}
