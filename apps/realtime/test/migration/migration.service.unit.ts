import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { createMock, DeepMocked } from '@/../test/utils/create-mock.util';
import { LegacyService } from '@/legacy/legacy.service';
import { MigrationState } from '@/legacy/services/migrate/constants';
import { MigrationCacheService } from '@/migration/cache/cache.service';
import { MigrationService } from '@/migration/migration.service';
import { ProjectLegacyService } from '@/project/project-legacy/project-legacy.service';

describe('Migrate service unit tests', () => {
  let legacyService: DeepMocked<LegacyService>;
  let migrateService: MigrationService;
  let migrationCacheService: DeepMocked<MigrationCacheService>;
  let projectLegacyService: DeepMocked<ProjectLegacyService>;

  beforeEach(async () => {
    legacyService = createMock<LegacyService>({
      models: {
        version: {
          adapter: {
            toDB: vi.fn().mockReturnValue({ a: '1', b: 'b' } as any),
          },
          updateByID: vi.fn(),
        },
        diagram: {
          adapter: {
            fromDB: vi.fn().mockReturnValue({} as any),
            toDB: vi
              .fn()
              .mockReturnValueOnce({ diagramID: 'diagramID', versionID: 'versionID' })
              .mockReturnValue({ a: '1', b: 'b' } as any),
          },
          updateOne: vi.fn(),
          findManyByVersionID: vi.fn().mockRejectedValue([]),
        },
      },
    });

    projectLegacyService = createMock<ProjectLegacyService>({
      get: vi.fn().mockResolvedValue(undefined),
    });

    migrationCacheService = createMock<MigrationCacheService>({
      isMigrationLocked: vi.fn().mockResolvedValue(false),
      resetMigrationLock: vi.fn().mockResolvedValue(undefined),
      acquireMigrationLock: vi.fn().mockResolvedValue(undefined),
      setActiveSchemaVersion: vi.fn().mockResolvedValue(undefined),
      getActiveSchemaVersion: vi.fn().mockResolvedValue(Realtime.SchemaVersion.V1),
    });

    migrateService = new MigrationService(legacyService, projectLegacyService, migrationCacheService);
  });

  describe('#migrateSchema()', () => {
    const creatorID = 123;
    const projectID = 'projectID';
    const versionID = 'versionID';
    const clientNodeID = 'clientID';
    const schemaVersion = Realtime.SchemaVersion.V2;
    const version = { projectID, _id: versionID, _version: Realtime.SchemaVersion.V1 } as BaseVersion.Version;

    const expectMigrationStates = async (migrator: AsyncIterable<MigrationState>, states: MigrationState[]) => {
      const generator = migrator[Symbol.asyncIterator]();

      for (const state of states) {
        // eslint-disable-next-line no-await-in-loop
        await expect(generator.next()).resolves.toEqual({ done: false, value: state });
      }

      await expect(generator.next()).resolves.toEqual({ done: true, value: undefined });
    };

    it('yield NOT_ALLOWED if migration in progress', async () => {
      migrationCacheService.isMigrationLocked.mockResolvedValueOnce(true);

      const migrator = migrateService.migrateSchema({ creatorID, clientNodeID, targetSchemaVersion: schemaVersion, version });

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);

      expect(migrationCacheService.isMigrationLocked).toBeCalledWith(versionID);
    });

    it('yield NOT_REQUIRED if active schema version already meets target version', async () => {
      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V2 });

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(migrationCacheService.getActiveSchemaVersion).toBeCalledWith(versionID);
    });

    it('yield NOT_SUPPORTED if active schema version is incompatible with target version', async () => {
      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(Realtime.SchemaVersion.V2);

      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V1 });

      await expectMigrationStates(migrator, [MigrationState.NOT_SUPPORTED]);
    });

    it('yield NOT_REQUIRED if no pending migrations exist based for version in database', async () => {
      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(null);

      const migrator = migrateService.migrateSchema({
        creatorID,
        version: { ...version, _version: Infinity },
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
    });

    it('yield NOT_ALLOWED if unable to acquire migration lock', async () => {
      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(null);
      migrationCacheService.acquireMigrationLock.mockRejectedValueOnce('error');

      const migrator = migrateService.migrateSchema({
        creatorID,
        version: { ...version, _version: Realtime.SchemaVersion.V1 },
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(migrationCacheService.acquireMigrationLock).toBeCalledWith(versionID, clientNodeID);
    });

    it('reset migration lock when error encountered', async () => {
      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(null);

      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V2 });
      const generator = migrator[Symbol.asyncIterator]();

      await expect(generator.next()).resolves.toEqual({ done: false, value: MigrationState.STARTED });
      await expect(generator.next()).rejects.toThrow();
      expect(migrationCacheService.resetMigrationLock).toBeCalledWith(versionID);
    });

    it('perform migrations on resources and save them back to the database', async () => {
      const diagramID = 'diagramID';
      const targetSchemaVersion = Realtime.SchemaVersion.V1;
      const versionData: Partial<BaseVersion.Version> = {
        creatorID,
        projectID,
        _id: versionID,
        _version: 0,
        platformData: {} as any,
        variables: ['first', 'second'],
        name: 'bar',
        rootDiagramID: 'diagramID',
      };

      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(null);

      legacyService.models.diagram.findManyByVersionID.mockResolvedValueOnce([{ creatorID, versionID, _id: diagramID } as any]);
      projectLegacyService.get.mockResolvedValueOnce({
        _id: '',
        creatorID: 1,
        name: '',
        type: Platform.Constants.ProjectType.CHAT,
        platform: Platform.Constants.PlatformType.VOICEFLOW,
        teamID: '1',
        members: [],
        customThemes: [],
        platformData: {},
      });

      const migrator = migrateService.migrateSchema({ creatorID, version: { ...version, ...versionData }, clientNodeID, targetSchemaVersion });

      await expectMigrationStates(migrator, [MigrationState.STARTED, MigrationState.DONE]);

      expect(legacyService.models.version.updateByID).toBeCalledWith(versionID, { a: '1', b: 'b' });

      expect(legacyService.models.diagram.updateOne.mock.calls).toEqual([
        [
          { diagramID: 'diagramID', versionID: 'versionID' },
          { a: '1', b: 'b' },
        ],
      ]);
    });
  });
});
