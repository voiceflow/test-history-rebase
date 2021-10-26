import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractActionControl, ActionAccessor } from '@/actions/utils';
import { BaseContextData, Context } from '@/types';

export const accessVersion = <P extends Realtime.BaseVersionPayload, D extends BaseContextData = BaseContextData>(
  self: AbstractActionControl<P, D>
): ActionAccessor<P, D> =>
  async function (this: AbstractActionControl<P, D>, ctx: Context<D>, action: Action<P>): Promise<boolean> {
    const { creatorID } = ctx.data;

    return (
      await Promise.all([
        this.services.workspace.canRead(creatorID, action.payload.workspaceID),
        this.services.project.canRead(creatorID, action.payload.projectID),
        this.services.version.canRead(creatorID, action.payload.versionID),
      ])
    ).every(Boolean);
  }.bind(self);

export abstract class AbstractVersionResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessVersion(this);

  protected resend = resendProjectChannel;
}
