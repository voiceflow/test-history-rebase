import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractActionControl, ActionAccessor, BoundActionAccessor } from '@/actions/utils';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function accessVersion<C extends AbstractActionControl<P, D>, P extends Realtime.BaseVersionPayload, D extends object = {}>(
  this: C,
  ctx: Context<D>,
  action: Action<P>
): Promise<boolean> {
  const creatorID = Number(ctx.userId);

  return (
    await Promise.all([
      this.services.workspace.canRead(creatorID, action.payload.workspaceID),
      this.services.project.canRead(creatorID, action.payload.projectID),
      this.services.version.canRead(creatorID, action.payload.versionID),
    ])
  ).every(Boolean);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class AbstractVersionResourceControl<P extends Realtime.BaseVersionPayload, D extends object = {}> extends AbstractActionControl<
  P,
  D
> {
  protected access: ActionAccessor<P, D> = accessVersion.bind<BoundActionAccessor<P, D>>(this);

  protected resend = resendProjectChannel;
}
