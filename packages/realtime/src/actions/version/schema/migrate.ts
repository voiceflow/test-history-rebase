/* eslint-disable max-classes-per-file */
import * as Realtime from '@voiceflow/realtime-sdk';
import { noAccess, Resender } from '@voiceflow/socket-utils';
import { Failure, Success } from 'typescript-fsa';

import { AbstractNoopActionControl } from '@/actions/utils';

export abstract class AbstractMigrateActionControl<T> extends AbstractNoopActionControl<T> {
  // only allow server-sent actions
  protected access = noAccess(this);

  protected resend: Resender<T> = (_ctx, { payload }) => ({
    channel: Realtime.Channels.schema.build({ versionID: this.extractVersionID(payload) }),
  });

  protected abstract extractVersionID(payload: T): string;
}

export class MigrateSchemaStarted extends AbstractMigrateActionControl<Realtime.version.schema.MigratePayload> {
  protected actionCreator = Realtime.version.schema.migrate.started;

  protected extractVersionID = ({ versionID }: Realtime.version.schema.MigratePayload): string => versionID;
}

type MigrateSuccess = Success<Realtime.version.schema.MigratePayload, Realtime.version.schema.NegotiateResultPayload>;

export class MigrateSchemaDone extends AbstractMigrateActionControl<MigrateSuccess> {
  protected actionCreator = Realtime.version.schema.migrate.done;

  protected extractVersionID = ({ params: { versionID } }: MigrateSuccess): string => versionID;
}

type MigrateFailure = Failure<Realtime.version.schema.MigratePayload, Realtime.RealtimeError>;

export class MigrateSchemaFailed extends AbstractMigrateActionControl<MigrateFailure> {
  protected actionCreator = Realtime.version.schema.migrate.failed;

  protected extractVersionID = ({ params: { versionID } }: MigrateFailure): string => versionID;
}
