import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { AnyResponseAttachmentJSON, AnyResponseVariantJSON } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

@Injectable()
export class ResponseAttachmentLoguxService {
  constructor(@Inject(LoguxService) private readonly logux: LoguxService) {}

  async broadcastSync({ sync }: { sync: { responseVariants: AnyResponseVariantJSON[] } }, meta: CMSBroadcastMeta) {
    await Promise.all(
      sync.responseVariants.map((variant) =>
        this.logux.processAs(
          Actions.ResponseVariant.PatchOne({
            id: variant.id,
            patch: { attachmentOrder: variant.attachmentOrder },
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
      add: { responseAttachments: AnyResponseAttachmentJSON[] };
      sync: { responseVariants: AnyResponseVariantJSON[] };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.logux.processAs(
        Actions.ResponseAttachment.AddMany({
          data: add.responseAttachments,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
      this.broadcastSync({ sync }, meta),
    ]);
  }
}
