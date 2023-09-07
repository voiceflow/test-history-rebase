import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface PatchIntentPayload
  extends Realtime.intent.BaseIntentPayload,
    Realtime.actionUtils.CRUDValuePayload<Partial<Platform.Base.Models.Intent.Model>> {}

class PatchIntent extends AbstractVersionResourceControl<PatchIntentPayload> {
  protected actionCreator = Realtime.intent.crud.patch;

  process = async (_ctx: Context, { payload }: Action<PatchIntentPayload>) => {
    const { versionID, key, value, projectMeta } = payload;

    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    await this.services.intent.update(versionID, key, projectConfig.adapters.intent.smart.toDB(sanitizePatch(value)));
  };

  protected finally = async (ctx: Context, { payload }: Action<PatchIntentPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchIntent;
