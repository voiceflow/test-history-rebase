import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  AnyResponseAttachmentObject,
  AnyResponseVariantObject,
  RequiredEntityObject,
  ResponseDiscriminatorObject,
  ResponseObject,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

import { ResponseRepository } from './response.repository';
import { ResponseDiscriminatorService } from './response-discriminator/response-discriminator.service';

@Injectable()
export class ResponseLoguxService {
  constructor(
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ResponseDiscriminatorService)
    private readonly responseDiscriminator: ResponseDiscriminatorService,
    @Inject(ResponseRepository)
    private readonly repository: ResponseRepository
  ) {}

  async broadcastDeleteMany(
    {
      sync,
      delete: del,
    }: {
      sync: { requiredEntities: RequiredEntityObject[] };
      delete: {
        responses: ResponseObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.broadcastSyncOnDelete({ sync }, meta),

      this.logux.processAs(
        Actions.Response.DeleteMany({
          ids: toPostgresEntityIDs(del.responses),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.responseDiscriminator.broadcastDeleteMany(
        { delete: Utils.object.pick(del, ['responseVariants', 'responseAttachments', 'responseDiscriminators']) },
        meta
      ),
    ]);
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        responses: ResponseObject[];
        responseVariants: AnyResponseVariantObject[];
        responseAttachments: AnyResponseAttachmentObject[];
        responseDiscriminators: ResponseDiscriminatorObject[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseDiscriminator.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseVariants', 'responseAttachments', 'responseDiscriminators']),
        },
        meta
      ),

      this.logux.processAs(
        Actions.Response.AddMany({
          data: this.repository.mapToJSON(add.responses),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async broadcastSyncOnDelete(
    { sync }: { sync: { requiredEntities: RequiredEntityObject[] } },
    meta: CMSBroadcastMeta
  ) {
    await this.logux.processAs(
      Actions.RequiredEntity.PatchMany({
        ids: toPostgresEntityIDs(sync.requiredEntities),
        patch: { repromptID: null },
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }
}
