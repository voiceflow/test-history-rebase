import { Inject, Injectable } from '@nestjs/common';
import { LoguxService } from '@voiceflow/nestjs-logux';
import { UtteranceJSON } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { cmsBroadcastContext, toPostgresEntityIDs } from '@/common/utils';
import { CMSBroadcastMeta } from '@/types';

@Injectable()
export class UtteranceLoguxService {
  constructor(
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  async broadcastAddMany({ add }: { add: { utterances: UtteranceJSON[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Utterance.AddMany({
        data: add.utterances,
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }

  async broadcastDeleteMany({ delete: del }: { delete: { utterances: UtteranceJSON[] } }, meta: CMSBroadcastMeta) {
    await this.logux.processAs(
      Actions.Utterance.DeleteMany({
        ids: toPostgresEntityIDs(del.utterances),
        context: cmsBroadcastContext(meta.context),
      }),
      meta.auth
    );
  }
}
