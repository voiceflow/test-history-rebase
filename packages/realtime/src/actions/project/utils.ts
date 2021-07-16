/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import { ProjectPayload } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '../utils';

export abstract class AbstractProjectActionControl<P extends ProjectPayload, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.project.canRead(action.payload.projectID, Number(ctx.userId));

  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.project({ projectID: action.payload.projectID }),
  });
}

export abstract class NoopProjectActionControl<P extends ProjectPayload, D extends object = {}> extends AbstractProjectActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
