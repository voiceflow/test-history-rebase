import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractDiagramResourceControl } from './utils';

type RemoveDiagramPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveDiagram extends AbstractDiagramResourceControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveDiagramPayload>) => {
    const { creatorID } = ctx.data;

    const [version] = await Promise.all([
      this.services.version.get(creatorID, payload.versionID),
      this.services.diagram.delete(creatorID, payload.key),
    ]);

    await this.services.version.patch(creatorID, payload.versionID, {
      topics: (version.topics ?? []).filter((topic) => topic.sourceID !== payload.key),
      components: (version.components ?? []).filter((component) => component.sourceID !== payload.key),
    });
  };
}

export default RemoveDiagram;
