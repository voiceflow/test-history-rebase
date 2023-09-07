import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class RefreshIntents extends AbstractVersionResourceControl<Realtime.intent.BaseIntentPayload> {
  protected actionCreator = Realtime.intent.crud.refresh;

  protected process = async (ctx: Context, { payload }: Action<Realtime.intent.BaseIntentPayload>) => {
    const { versionID, projectMeta, workspaceID, projectID } = payload;

    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    const intents = await this.services.intent.getAll(versionID).then((intents) => projectConfig.adapters.intent.simple.mapFromDB(intents));

    await ctx.sendBack(Realtime.intent.crud.replace({ values: intents, projectID, workspaceID, versionID, projectMeta }));
  };
}

export default RefreshIntents;
