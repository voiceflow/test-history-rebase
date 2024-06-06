import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { AnyResponseAttachmentJSON, AnyResponseVariantJSON, ResponseDiscriminatorJSON } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

import { ResponseAttachmentLoguxService } from '../response-attachment/response-attachment.logux.service';

@Injectable()
export class ResponseVariantLoguxService {
  constructor(
    @Inject(LoguxService) private readonly logux: LoguxService,
    @Inject(ResponseAttachmentLoguxService) private readonly responseAttachment: ResponseAttachmentLoguxService
  ) {}

  async broadcastSync(
    { sync }: { sync: { responseDiscriminators: ResponseDiscriminatorJSON[] } },
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

  async broadcastAddMany(
    {
      add,
      sync,
    }: {
      add: { responseVariants: AnyResponseVariantJSON[]; responseAttachments: AnyResponseAttachmentJSON[] };
      sync: { responseDiscriminators: ResponseDiscriminatorJSON[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.responseAttachment.broadcastAddMany(
        {
          add: Utils.object.pick(add, ['responseAttachments']),
          // no need to sync attachments, should be synced on create
          sync: { responseVariants: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.ResponseVariant.AddMany({
          data: add.responseVariants,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),

      this.broadcastSync({ sync }, meta),
    ]);
  }
}
