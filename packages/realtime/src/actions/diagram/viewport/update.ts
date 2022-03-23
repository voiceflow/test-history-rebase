import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';

type UpdateViewportPayload = Realtime.actionUtils.CRUDValuePayload<Realtime.ViewportModel>;

class UpdateViewport extends AbstractActionControl<UpdateViewportPayload> {
  protected actionCreator = Realtime.diagram.viewport.crud.update;

  protected access = (ctx: Context, action: Action<UpdateViewportPayload>): Promise<boolean> =>
    this.services.diagram.canRead(ctx.data.creatorID, action.payload.key);

  protected process = async (
    ctx: Context,
    {
      payload: {
        key: diagramID,
        value: { x, y, zoom },
      },
    }: Action<UpdateViewportPayload>
  ) => {
    const { creatorID } = ctx.data;

    await this.services.diagram.patch(creatorID, diagramID, {
      offsetX: x,
      offsetY: y,
      zoom,
    });
  };
}

export default UpdateViewport;
