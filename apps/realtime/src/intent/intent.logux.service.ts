import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import {
  AnyResponseAttachmentJSON,
  AnyResponseVariantJSON,
  IntentJSON,
  IntentObject,
  RequiredEntityJSON,
  ResponseDiscriminatorJSON,
  ResponseJSON,
  UtteranceJSON,
} from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

import { RequiredEntityLoguxService } from './required-entity/required-entity.logux.service';
import { UtteranceLoguxService } from './utterance/utterance.logux.service';

@Injectable()
export class IntentLoguxService {
  constructor(
    @Inject(UtteranceLoguxService) private readonly utterance: UtteranceLoguxService,
    @Inject(RequiredEntityLoguxService) private readonly requiredEntity: RequiredEntityLoguxService,
    @Inject(LoguxService) private readonly logux: LoguxService
  ) {}

  async broadcastDeleteMany(
    {
      delete: del,
    }: {
      delete: {
        intents: IntentObject[];
        utterances: UtteranceJSON[];
        requiredEntities: RequiredEntityJSON[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.utterance.broadcastDeleteMany({ delete: Utils.object.pick(del, ['utterances']) }, meta),
      // no need to sync intents, because they are deleted
      this.requiredEntity.broadcastDeleteMany(
        { sync: { intents: [] }, delete: Utils.object.pick(del, ['requiredEntities']) },
        meta
      ),

      this.logux.processAs(
        Actions.Intent.DeleteMany({
          ids: toPostgresEntityIDs(del.intents),
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }

  async broadcastAddMany(
    {
      add,
    }: {
      add: {
        intents: IntentJSON[];
        responses: ResponseJSON[];
        utterances: UtteranceJSON[];
        requiredEntities: RequiredEntityJSON[];
        responseVariants: AnyResponseVariantJSON[];
        responseAttachments: AnyResponseAttachmentJSON[];
        responseDiscriminators: ResponseDiscriminatorJSON[];
      };
    },
    meta: CMSBroadcastMeta
  ) {
    await Promise.all([
      this.utterance.broadcastAddMany({ add: Utils.object.pick(add, ['utterances']) }, meta),

      this.requiredEntity.broadcastAddMany(
        {
          add: Utils.object.pick(add, [
            'responses',
            'responseVariants',
            'requiredEntities',
            'responseAttachments',
            'responseDiscriminators',
          ]),
          // no need to sync intents, since they should be synced in the create method
          sync: { intents: [] },
        },
        meta
      ),

      this.logux.processAs(
        Actions.Intent.AddMany({
          data: add.intents,
          context: cmsBroadcastContext(meta.context),
        }),
        meta.auth
      ),
    ]);
  }
}
