/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '@/actions/utils';

export abstract class AbstractLinkActionControl<P extends Realtime.BaseLinkPayload, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(Number(ctx.userId), action.payload.diagramID);
}

export abstract class AbstractResendLinkActionControl<P extends Realtime.BaseLinkPayload, D extends object = {}> extends AbstractLinkActionControl<
  P,
  D
> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class AbstractNoopLinkActionControl<
  P extends Realtime.BaseLinkPayload,
  D extends object = {}
> extends AbstractResendLinkActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
