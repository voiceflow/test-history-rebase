/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import { DiagramPayload } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '../utils';

export abstract class AbstractDiagramActionControl<P extends DiagramPayload, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(action.payload.diagramID, Number(ctx.userId));

  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram({ diagramID: action.payload.diagramID, projectID: action.payload.projectID }),
  });
}

export abstract class NoopDiagramActionControl<P extends DiagramPayload, D extends object = {}> extends AbstractDiagramActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
