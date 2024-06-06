import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { AnyResponseAttachmentJSON, AnyResponseVariantJSON, ResponseDiscriminatorJSON } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

import { ResponseVariantLoguxService } from '../response-variant/response-variant.logux.service';

@Injectable()
export class ResponseDiscriminatorLoguxService {
  constructor(
    @Inject(ResponseVariantLoguxService) private readonly responseVariant: ResponseVariantLoguxService,
    @Inject(LoguxService) private readonly logux: LoguxService
  ) {}

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        responseVariants: AnyResponseVariantJSON[];
        responseAttachments: AnyResponseAttachmentJSON[];
        responseDiscriminators: ResponseDiscriminatorJSON[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseVariant.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseVariants', 'responseAttachments']),
          // no need to sync, cause should be synced on create
          sync: { responseDiscriminators: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.ResponseDiscriminator.AddMany({
          data: add.responseDiscriminators,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }
}
