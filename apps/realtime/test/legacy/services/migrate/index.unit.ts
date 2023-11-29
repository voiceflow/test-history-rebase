import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import MigrateService from '@/legacy/services/migrate';
import { MigrationState } from '@/legacy/services/migrate/constants';

describe('Migrate service unit tests', () => {
  describe('migrateSchema()', () => {
    const creatorID = 123;
    const projectID = 'projectID';
    const versionID = 'versionID';
    const clientNodeID = 'clientID';
    const schemaVersion = Realtime.SchemaVersion.V2;

    const expectMigrationStates = async (migrator: AsyncIterable<MigrationState>, states: MigrationState[]) => {
      const generator = migrator[Symbol.asyncIterator]();

      for (const state of states) {
        // eslint-disable-next-line no-await-in-loop
        await expect(generator.next()).resolves.toEqual({ done: false, value: state });
      }

      await expect(generator.next()).resolves.toEqual({ done: true, value: undefined });
    };

    it('yield NOT_ALLOWED if migration in progress', async () => {
      const isMigrationLocked = vi.fn().mockResolvedValue(true);
      const migrateService = new MigrateService({} as any);
      migrateService.isMigrationLocked = isMigrationLocked;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, schemaVersion);

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(isMigrationLocked).toBeCalledWith(versionID);
    });

    it('yield NOT_REQUIRED if active schema version already meets target version', async () => {
      const getActiveSchemaVersion = vi.fn().mockResolvedValue(Realtime.SchemaVersion.V1);
      const migrateService = new MigrateService({} as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = getActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(getActiveSchemaVersion).toBeCalledWith(versionID);
    });

    it('yield NOT_SUPPORTED if active schema version is incompatible with target version', async () => {
      const migrateService = new MigrateService({} as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => Realtime.SchemaVersion.V2;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V1);

      await expectMigrationStates(migrator, [MigrationState.NOT_SUPPORTED]);
    });

    it('yield NOT_REQUIRED if no pending migrations exist based for version in database', async () => {
      const version = { _version: Infinity };
      const options = {
        services: {
          version: {
            get: vi.fn().mockResolvedValue(version),
          },
        },
      };
      const setActiveSchemaVersion = vi.fn();
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.setActiveSchemaVersion = setActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(setActiveSchemaVersion).toBeCalledWith(versionID, version._version);
    });

    it('yield NOT_ALLOWED if unable to acquire migration lock', async () => {
      const options = {
        services: {
          version: {
            get: vi.fn().mockResolvedValue({ _version: Realtime.SchemaVersion.V1 }),
          },
        },
        log: { debug: vi.fn() },
      };
      const acquireMigrationLock = vi.fn().mockRejectedValue('error');
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = acquireMigrationLock;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(acquireMigrationLock).toBeCalledWith(versionID, clientNodeID);
    });

    it('reset migration lock when error encountered', async () => {
      const options = {
        services: {
          version: {
            get: vi.fn().mockResolvedValue({ _version: Realtime.SchemaVersion.V1 }),
          },
        },
      };
      const resetMigrationLock = vi.fn().mockResolvedValue(undefined);
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = () => Promise.resolve();
      migrateService.resetMigrationLock = resetMigrationLock;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);
      const generator = migrator[Symbol.asyncIterator]();

      await expect(generator.next()).resolves.toEqual({ done: false, value: MigrationState.STARTED });
      await expect(generator.next()).to.rejects.toThrow();
      expect(resetMigrationLock).toBeCalledWith(versionID);
    });

    it('perform migrations on resources and save them back to the database', async () => {
      const diagramID = 'diagramID';
      const targetSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        services: {
          project: {
            get: vi.fn().mockResolvedValue({ type: Platform.Constants.ProjectType.CHAT, platform: Platform.Constants.PlatformType.VOICEFLOW }),
          },
          version: {
            get: vi.fn().mockResolvedValue({
              creatorID,
              projectID,
              _id: versionID,
              _version: 0,
              platformData: { fizz: 'buzz' },
              variables: ['first', 'second'],
              name: 'bar',
              rootDiagramID: 'diagramID',
            }),
            replaceResources: vi.fn().mockResolvedValue(undefined),
          },
          diagram: {
            getAll: vi.fn().mockResolvedValue([
              {
                creatorID,
                versionID,
                _id: diagramID,
                foo: 'bar',
              },
            ]),
          },
        },
      };
      const setActiveSchemaVersion = vi.fn().mockResolvedValue(undefined);
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = () => Promise.resolve();
      migrateService.setActiveSchemaVersion = setActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, targetSchemaVersion);

      await expectMigrationStates(migrator, [MigrationState.STARTED, MigrationState.DONE]);
      expect(setActiveSchemaVersion).toBeCalledWith(versionID, targetSchemaVersion);
      expect(options.services.version.replaceResources).toBeCalledWith(
        versionID,
        {
          _version: targetSchemaVersion,
          name: 'bar',
          variables: ['first', 'second'],
          folders: undefined,
          components: undefined,
          rootDiagramID: 'diagramID',
          templateDiagramID: undefined,
          platformData: { fizz: 'buzz' },
          topics: undefined,
          domains: undefined,
        },
        [[diagramID, { foo: 'bar' }]]
      );
    });
  });
});
