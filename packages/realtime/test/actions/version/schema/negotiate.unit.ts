import type { ServerMeta } from '@logux/server';
import { Eventual } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AsyncRejectionError, Context } from '@voiceflow/socket-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import { Action } from 'typescript-fsa';

import NegotiateControl, {
  INTERNAL_ERROR_MESSAGE,
  MIGRATION_IN_PROGRESS_MESSAGE,
  SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE,
} from '@/actions/version/schema/negotiate';
import { MigrationState } from '@/services/migrate/constants';

describe('version.schema.NEGOTIATE action unit tests', () => {
  const creatorID = 123;
  const context = { data: { creatorID } };

  describe('access()', () => {
    const versionID = 'versionID';
    const action = { payload: { versionID } };

    it('allows access', async () => {
      const options = {
        services: {
          version: {
            access: {
              canRead: sinon.stub().resolves(true),
            },
          },
        },
      };
      const control = new NegotiateControl(options as any);

      const canAccess = await control.access(context as any, action as any);

      expect(canAccess).to.be.true;
      expect(options.services.version.access.canRead).to.be.calledWithExactly(creatorID, versionID);
    });

    it('does not allow access', async () => {
      const options = {
        services: {
          version: {
            access: {
              canRead: sinon.stub().resolves(false),
            },
          },
        },
      };
      const control = new NegotiateControl(options as any);

      await expect(control.access(context as any, action as any)).to.eventually.be.false;
    });
  });

  describe('process()', () => {
    const workspaceID = 'workspaceID';
    const projectID = 'projectID';
    const versionID = 'versionID';
    const getReplyHandler = (
      control: NegotiateControl
    ): ((
      ctx: Context,
      action: Action<Realtime.version.schema.NegotiatePayload>,
      meta: ServerMeta
    ) => Eventual<Realtime.version.schema.NegotiateResultPayload>) => control.$reply.args[0][1];

    it('registers a reply callback', async () => {
      const control = new NegotiateControl({ services: {}, clients: {} } as any);

      await control.process({} as any, {} as any, {} as any);

      expect(control.$reply).to.be.calledWithExactly(Realtime.version.schema.negotiate, sinon.match.func);
    });

    it("fail if target schema is outside of client's supported range", async () => {
      const options = {
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(Realtime.SchemaVersion.V2),
          },
        },
      };
      const action = { payload: { proposedSchemaVersion: Realtime.SchemaVersion.V1 } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).to.be.rejectedWith(
        AsyncRejectionError,
        SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE
      );

      expect(control.$reject).to.be.calledWithExactly(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
    });

    it('broadcast unexpected error during migration to any blocked clients', async () => {
      const migrator = [MigrationState.DONE];
      const schemaVersion = Realtime.SchemaVersion.V2;
      const options = {
        server: {
          process: sinon.stub().onFirstCall().throws().onSecondCall().resolves(),
        },
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(schemaVersion),
            migrateSchema: sinon.stub().returns(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: schemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).to.be.rejected;

      expect(options.server.process).to.be.calledWithExactly(
        Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } })
      );
    });

    it('skip migration if NOT_REQUIRED status received', async () => {
      const migrator = [MigrationState.NOT_REQUIRED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: sinon.stub().resolves(),
        },
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(targetSchemaVersion),
            migrateSchema: sinon.stub().returns(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const skipResult = { workspaceID, projectID, schemaVersion: currentSchemaVersion };
      const control = new NegotiateControl(options as any);

      const result = await getReplyHandler(control)(context as any, action as any, {} as any);

      expect(result).to.eql(skipResult);
      expect(options.server.process).to.be.calledWithExactly(Realtime.version.schema.migrate.done({ params: { versionID }, result: skipResult }));
    });

    it('fail early if migration is already in progress', async () => {
      const migrator = [MigrationState.NOT_ALLOWED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: sinon.stub().resolves(),
        },
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(targetSchemaVersion),
            migrateSchema: sinon.stub().returns(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).to.be.rejected;

      expect(control.$reject).to.be.calledWithExactly(MIGRATION_IN_PROGRESS_MESSAGE, Realtime.ErrorCode.MIGRATION_IN_PROGRESS);
    });

    it('fail early if target version range is not supported', async () => {
      const migrator = [MigrationState.NOT_SUPPORTED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: sinon.stub().resolves(),
        },
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(targetSchemaVersion),
            migrateSchema: sinon.stub().returns(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).to.be.rejected;

      expect(control.$reject).to.be.calledWithExactly(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
    });

    it('applies migrations and broadcasts migration status', async () => {
      const migrator = [MigrationState.STARTED, MigrationState.DONE];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: sinon.stub().resolves(),
        },
        services: {
          project: {
            get: sinon.stub().resolves({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: sinon.stub().resolves(true),
            },
          },
          version: {
            get: sinon.stub().resolves({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: sinon.stub().resolves(targetSchemaVersion),
            migrateSchema: sinon.stub().returns(migrator),
          },
        },
      };
      const context = { data: { creatorID }, sendBack: sinon.stub() };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const migrateResult = { workspaceID, projectID, schemaVersion: targetSchemaVersion };
      const control = new NegotiateControl(options as any);

      const result = await getReplyHandler(control)(context as any, action as any, {} as any);

      expect(result).to.eql(migrateResult);
      expect(context.sendBack).to.be.calledWithExactly(Realtime.version.schema.migrate.started({ versionID }));
      expect(options.server.process).to.be.calledWithExactly(Realtime.version.schema.migrate.done({ params: { versionID }, result: migrateResult }));
    });
  });
});
