/* eslint-disable max-classes-per-file */
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ActionAccessor, BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { resendProjectChannel } from '@/legacy/actions/project/utils';
import { AbstractActionControl } from '@/legacy/actions/utils';

export const accessVersion = <P extends Realtime.BaseVersionPayload, D extends BaseContextData = BaseContextData>(
  self: AbstractActionControl<P, D>
): ActionAccessor<P, D> =>
  async function (this: AbstractActionControl<P, D>, ctx: Context<D>, action: Action<P>): Promise<boolean> {
    const { creatorID } = ctx.data;

    return (
      await Promise.all([
        this.services.workspace.access.canRead(creatorID, action.payload.workspaceID),
        this.services.project.access.canRead(creatorID, action.payload.projectID),
        this.services.version.access.canRead(creatorID, action.payload.versionID),
      ])
    ).every(Boolean);
  }.bind(self);

export abstract class AbstractVersionAccessResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends BaseContextData = BaseContextData,
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessVersion(this);
}

export abstract class AbstractVersionResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends BaseContextData = BaseContextData,
> extends AbstractVersionAccessResourceControl<P, D> {
  protected resend = resendProjectChannel;
}
