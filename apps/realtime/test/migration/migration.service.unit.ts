import type { EntityManager } from '@mikro-orm/core';
import type { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import type { DeepMocked } from '@/../test/utils/create-mock.util';
import { createMock } from '@/../test/utils/create-mock.util';
import type { AssistantSerializer } from '@/assistant/assistant.serializer';
import type { AssistantService } from '@/assistant/assistant.service';
import type { BackupService } from '@/backup/backup.service';
import type { EnvironmentService } from '@/environment/environment.service';
import type { LegacyService } from '@/legacy/legacy.service';
import { MigrationState } from '@/legacy/services/migrate/constants';
import type { MigrationCacheService } from '@/migration/cache/cache.service';
import { MigrationService } from '@/migration/migration.service';
import type { ProjectLegacyService } from '@/project/project-legacy/project-legacy.service';

describe('Migrate service unit tests', () => {
  let legacyService: DeepMocked<LegacyService>;
  let entityManager: DeepMocked<EntityManager>;
  let backupService: DeepMocked<BackupService>;
  let migrateService: MigrationService;
  let assistantService: DeepMocked<AssistantService>;
  let environmentService: DeepMocked<EnvironmentService>;
  let assistantSerializer: DeepMocked<AssistantSerializer>;
  let projectLegacyService: DeepMocked<ProjectLegacyService>;
  let migrationCacheService: DeepMocked<MigrationCacheService>;

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

    backupService = createMock<BackupService>({
      findOneByName: vi.fn().mockResolvedValue({}),
    });

    migrationCacheService = createMock<MigrationCacheService>({
      isMigrationLocked: vi.fn().mockResolvedValue(false),
      resetMigrationLock: vi.fn().mockResolvedValue(undefined),
      acquireMigrationLock: vi.fn().mockResolvedValue(undefined),
      setActiveSchemaVersion: vi.fn().mockResolvedValue(undefined),
      getActiveSchemaVersion: vi.fn().mockResolvedValue(Realtime.SchemaVersion.V1),
    });

    entityManager = createMock<EntityManager>();

    assistantService = createMock<AssistantService>({
      findOne: vi.fn().mockResolvedValue(null),
    });

    environmentService = createMock<EnvironmentService>({
      findOneCMSDataToMigrate: vi.fn().mockResolvedValue({
        intents: [],
        entities: [],
        responses: [],
        utterances: [],
        entityVariants: [],
        requiredEntities: [],
        responseVariants: [],
        responseMessages: [],
        responseDiscriminators: [],
      }),
    });

    assistantSerializer = createMock<AssistantSerializer>({
      serialize: vi.fn().mockReturnValue({} as any),
    });

    migrateService = new MigrationService(
      entityManager,
      legacyService,
      backupService,
      assistantService,
      environmentService,
      projectLegacyService,
      migrationCacheService,
      assistantSerializer
    );
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

      const migrator = migrateService.migrateSchema({
        creatorID,
        clientNodeID,
        targetSchemaVersion: schemaVersion,
        version,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);

      expect(migrationCacheService.isMigrationLocked).toBeCalledWith(versionID);
    });

    it('yield NOT_REQUIRED if active schema version already meets target version', async () => {
      const migrator = migrateService.migrateSchema({
        creatorID,
        version,
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(migrationCacheService.getActiveSchemaVersion).toBeCalledWith(versionID);
    });

    it('yield NOT_SUPPORTED if active schema version is incompatible with target version', async () => {
      migrationCacheService.getActiveSchemaVersion.mockResolvedValueOnce(Realtime.SchemaVersion.V2);

      const migrator = migrateService.migrateSchema({
        creatorID,
        version,
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V1,
      });

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

      entityManager.transactional.mockImplementationOnce(async (cb) => cb());

      const migrator = migrateService.migrateSchema({
        creatorID,
        version,
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });
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

      legacyService.models.diagram.findManyByVersionID.mockResolvedValueOnce([
        { creatorID, versionID, _id: diagramID } as any,
      ]);
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

      entityManager.transactional.mockImplementationOnce(async (cb) => cb());

      const migrator = migrateService.migrateSchema({
        creatorID,
        version: { ...version, ...versionData },
        clientNodeID,
        targetSchemaVersion,
      });

      await expectMigrationStates(migrator, [MigrationState.STARTED, MigrationState.DONE]);

      expect(legacyService.models.version.updateByID).toBeCalledWith(versionID, { a: '1', b: 'b' });

      expect(legacyService.models.diagram.updateOne.mock.calls).toEqual([]);
    });
  });
});
