import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  AnyResponseAttachmentJSON,
  AnyResponseVariantJSON,
  IntentJSON,
  RequiredEntityJSON,
  ResponseDiscriminatorJSON,
  ResponseJSON,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { ResponseLoguxService } from '@/response/response.logux.service';
import { CMSBroadcastMeta } from '@/types';

@Injectable()
export class RequiredEntityLoguxService {
  constructor(
    @Inject(LoguxService) private readonly logux: LoguxService,
    @Inject(ResponseLoguxService) private readonly response: ResponseLoguxService
  ) {}

  async broadcastSync({ sync }: { sync: { intents: IntentJSON[] } }, meta: CMSBroadcastMeta) {
    await Promise.all(
      sync.intents.map((intent) =>
        this.logux.processAs(
          Actions.Intent.PatchOne({
            id: intent.id,
            patch: { entityOrder: intent.entityOrder },
            context: cmsBroadcastContext(meta.context),
          }),
          meta.auth
        )
      )
    );
  }

  async broadcastDeleteMany(
    { sync, delete: del }: { sync: { intents: IntentJSON[] }; delete: { requiredEntities: RequiredEntityJSON[] } },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSync({ sync }, meta),

      this.logux.processAs(
        Actions.RequiredEntity.DeleteMany({
          ids: toPostgresEntityIDs(del.requiredEntities),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: {
        responses: ResponseJSON[];
        requiredEntities: RequiredEntityJSON[];
        responseVariants: AnyResponseVariantJSON[];
        responseAttachments: AnyResponseAttachmentJSON[];
        responseDiscriminators: ResponseDiscriminatorJSON[];
      };
      sync: { intents: IntentJSON[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.response.broadcastAddMany(
        {
          add: Utils.object.pick(add, [
            'responses',
            'responseVariants',
            'responseAttachments',
            'responseDiscriminators',
          ]),
        },
        meta
      ),

      this.logux.processAs(
        Actions.RequiredEntity.AddMany({
          data: add.requiredEntities,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync }, meta),
    ]);
  }
}
