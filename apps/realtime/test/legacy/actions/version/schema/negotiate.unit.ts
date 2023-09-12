import type { ServerMeta } from '@logux/server';
import { Eventual } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { AsyncRejectionError, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import NegotiateControl, {
  INTERNAL_ERROR_MESSAGE,
  MIGRATION_IN_PROGRESS_MESSAGE,
  SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE,
} from '@/legacy/actions/version/schema/negotiate';
import { MigrationState } from '@/legacy/services/migrate/constants';

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
              canRead: vi.fn().mockResolvedValue(true),
            },
          },
        },
      };
      const control = new NegotiateControl(options as any);

      const canAccess = await control.access(context as any, action as any);

      expect(canAccess).to.be.true;
      expect(options.services.version.access.canRead).toBeCalledWith(creatorID, versionID);
    });

    it('does not allow access', async () => {
      const options = {
        services: {
          version: {
            access: {
              canRead: vi.fn().mockResolvedValue(false),
            },
          },
        },
      };
      const control = new NegotiateControl(options as any);

      await expect(control.access(context as any, action as any)).resolves.toBeFalsy();
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
    ) => Eventual<Realtime.version.schema.NegotiateResultPayload>) => control.$reply.mock.calls[0][1];

    it('registers a reply callback', async () => {
      const control = new NegotiateControl({ services: {}, clients: {} } as any);

      await control.process({} as any, {} as any, {} as any);

      expect(control.$reply.mock.calls[0][0]).toBe(Realtime.version.schema.negotiate);
      expect(control.$reply.mock.calls[0][1]).toBeTypeOf('function');
    });

    it("fail if target schema is outside of client's supported range", async () => {
      const options = {
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(Realtime.SchemaVersion.V2),
          },
        },
      };
      const action = { payload: { proposedSchemaVersion: Realtime.SchemaVersion.V1 } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).rejects.toThrow(
        new AsyncRejectionError(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE)
      );

      expect(control.$reject).toBeCalledWith(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
    });

    it('broadcast unexpected error during migration to any blocked clients', async () => {
      const migrator = [MigrationState.DONE];
      const schemaVersion = Realtime.SchemaVersion.V2;
      const options = {
        server: {
          process: vi.fn().mockRejectedValueOnce('error').mockResolvedValueOnce(undefined),
        },
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(schemaVersion),
            migrateSchema: vi.fn().mockReturnValue(migrator),
          },
        },
        log: {
          error: vi.fn(),
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: schemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).rejects.toThrow();

      expect(options.server.process).toBeCalledWith(
        Realtime.version.schema.migrate.failed({ params: { versionID }, error: { message: INTERNAL_ERROR_MESSAGE } })
      );
    });

    it('skip migration if NOT_REQUIRED status received', async () => {
      const migrator = [MigrationState.NOT_REQUIRED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: vi.fn().mockResolvedValue(undefined),
        },
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(targetSchemaVersion),
            migrateSchema: vi.fn().mockReturnValue(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const skipResult = { workspaceID, projectID, schemaVersion: currentSchemaVersion };
      const control = new NegotiateControl(options as any);

      const result = await getReplyHandler(control)(context as any, action as any, {} as any);

      expect(result).to.eql(skipResult);
      expect(options.server.process).toBeCalledWith(Realtime.version.schema.migrate.done({ params: { versionID }, result: skipResult }));
    });

    it('fail early if migration is already in progress', async () => {
      const migrator = [MigrationState.NOT_ALLOWED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: vi.fn().mockResolvedValue(undefined),
        },
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(targetSchemaVersion),
            migrateSchema: vi.fn().mockReturnValue(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).rejects.toThrow();

      expect(control.$reject).toBeCalledWith(MIGRATION_IN_PROGRESS_MESSAGE, Realtime.ErrorCode.MIGRATION_IN_PROGRESS);
    });

    it('fail early if target version range is not supported', async () => {
      const migrator = [MigrationState.NOT_SUPPORTED];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: vi.fn().mockResolvedValue(undefined),
        },
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(targetSchemaVersion),
            migrateSchema: vi.fn().mockReturnValue(migrator),
          },
        },
      };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const control = new NegotiateControl(options as any);

      await expect(getReplyHandler(control)(context as any, action as any, {} as any)).rejects.toThrow();

      expect(control.$reject).toBeCalledWith(SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE, Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED);
    });

    it('applies migrations and broadcasts migration status', async () => {
      const migrator = [MigrationState.STARTED, MigrationState.DONE];
      const targetSchemaVersion = Realtime.SchemaVersion.V2;
      const currentSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        server: {
          process: vi.fn().mockResolvedValue(undefined),
        },
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ teamID: workspaceID, _version: currentSchemaVersion }),
            access: {
              canWrite: vi.fn().mockResolvedValue(true),
            },
          },
          version: {
            get: vi.fn().mockResolvedValue({ projectID }),
          },
          migrate: {
            getTargetSchemaVersion: vi.fn().mockResolvedValue(targetSchemaVersion),
            migrateSchema: vi.fn().mockReturnValue(migrator),
          },
        },
      };
      const context = { data: { creatorID }, sendBack: vi.fn() };
      const action = { payload: { versionID, proposedSchemaVersion: targetSchemaVersion } };
      const migrateResult = { workspaceID, projectID, schemaVersion: targetSchemaVersion };
      const control = new NegotiateControl(options as any);

      const result = await getReplyHandler(control)(context as any, action as any, {} as any);

      expect(result).to.eql(migrateResult);
      expect(context.sendBack).toBeCalledWith(Realtime.version.schema.migrate.started({ versionID }));
      expect(options.server.process).toBeCalledWith(Realtime.version.schema.migrate.done({ params: { versionID }, result: migrateResult }));
    });
  });
});
