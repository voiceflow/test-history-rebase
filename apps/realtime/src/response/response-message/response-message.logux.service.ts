import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { ResponseDiscriminatorObject, ResponseMessageObject, ResponseMessageORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

@Injectable()
export class ResponseMessageLoguxService {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(ResponseMessageORM)
    protected readonly orm: ResponseMessageORM,
    @Inject(LoguxService) private readonly logux: LoguxService
  ) {}

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: { responseMessages: ResponseMessageObject[] };
      sync: { responseDiscriminators: ResponseDiscriminatorObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.ResponseMessage.AddMany({
          data: this.mapToJSON(add.responseMessages),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync }, meta),
    ]);
  }

  async broadcastSync(
    { sync }: { sync: { responseDiscriminators: ResponseDiscriminatorObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all(
      sync.responseDiscriminators.map((discriminator) =>
        this.logux.processAs(
          Actions.ResponseDiscriminator.PatchOne({
            id: discriminator.id,
            patch: { variantOrder: discriminator.variantOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { responseDiscriminators: ResponseDiscriminatorObject[] };
      delete: { responseMessages: ResponseMessageObject[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),

      this.logux.processAs(
        Actions.ResponseMessage.DeleteMany({
          ids: toPostgresEntityIDs(del.responseMessages),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }
}
