import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  AnyResponseAttachmentJSON,
  AnyResponseVariantJSON,
  ResponseDiscriminatorJSON,
  ResponseJSON,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

import { ResponseDiscriminatorLoguxService } from './response-discriminator/response-discriminator.logux.service';

@Injectable()
export class ResponseLoguxService {
  constructor(
    @Inject(ResponseDiscriminatorLoguxService)
    private readonly responseDiscriminator: ResponseDiscriminatorLoguxService,
    @Inject(LoguxService) private readonly logux: LoguxService
  ) {}

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        responses: ResponseJSON[];
        responseVariants: AnyResponseVariantJSON[];
        responseAttachments: AnyResponseAttachmentJSON[];
        responseDiscriminators: ResponseDiscriminatorJSON[];
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
          data: add.responses,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }
}
