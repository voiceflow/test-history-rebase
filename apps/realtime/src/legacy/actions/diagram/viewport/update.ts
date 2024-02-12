import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/legacy/actions/utils';

type UpdateViewportPayload = Realtime.actionUtils.CRUDValuePayload<Realtime.ViewportModel>;

class UpdateViewport extends AbstractActionControl<UpdateViewportPayload> {
  protected actionCreator = Realtime.diagram.viewport.update;

  protected access = (ctx: Context, action: Action<UpdateViewportPayload>): Promise<boolean> =>
    this.services.version.access.canRead(ctx.data.creatorID, action.payload.value.versionID);

  protected process = async (
    _ctx: Context,
    {
      payload: {
        key: diagramID,
        value: { x, y, zoom, versionID },
      },
    }: Action<UpdateViewportPayload>
  ) => {
    await this.services.diagram.patch(versionID, diagramID, {
      offsetX: x,
      offsetY: y,
      zoom,
    });
  };
}

export default UpdateViewport;
