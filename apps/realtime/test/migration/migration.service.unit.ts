import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Logger } from 'nestjs-pino';
import { MockedObject, vi } from 'vitest';

import { DiagramService } from '@/diagram/diagram.service';
import { MigrationState } from '@/legacy/services/migrate/constants';
import { MigrationCacheService } from '@/migration/cache/cache.service';
import { MigrationService } from '@/migration/migration.service';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

describe('Migrate service unit tests', () => {
  let migrateService: MigrationService;
  const logger: MockedObject<Logger> = {
    call: vi.fn(),
    contextName: '',
    debug: vi.fn(),
    error: vi.fn(),
    isWrongExceptionsHandlerContract: vi.fn(),
    log: vi.fn(),
    logger: {} as any,
    verbose: vi.fn(),
    warn: vi.fn(),
  } as any;
  const diagramService = new DiagramService({} as any);
  const versionService = new VersionService(diagramService, {} as any);
  const projectService = new ProjectService({} as any, {} as any, versionService, {} as any, {} as any);
  const migrationCacheService = new MigrationCacheService({ getClient: vi.fn() } as any);

  beforeEach(async () => {
    migrateService = new MigrationService(migrationCacheService, projectService, diagramService, versionService, logger);
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

      // eslint-disable-next-line no-restricted-syntax
      for (const state of states) {
        // eslint-disable-next-line no-await-in-loop
        await expect(generator.next()).resolves.toEqual({ done: false, value: state });
      }

      await expect(generator.next()).resolves.toEqual({ done: true, value: undefined });
    };

    it('yield NOT_ALLOWED if migration in progress', async () => {
      const isMigrationLocked = vi.fn().mockResolvedValue(true);
      migrationCacheService.isMigrationLocked = isMigrationLocked;

      const migrator = migrateService.migrateSchema({ creatorID, clientNodeID, targetSchemaVersion: schemaVersion, version });

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(isMigrationLocked).toBeCalledWith(versionID);
    });

    it('yield NOT_REQUIRED if active schema version already meets target version', async () => {
      const getActiveSchemaVersion = vi.fn().mockResolvedValue(Realtime.SchemaVersion.V1);
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockImplementation(getActiveSchemaVersion);
      vi.spyOn(versionService, 'get').mockResolvedValue(version);

      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V2 });

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(getActiveSchemaVersion).toBeCalledWith(versionID);
    });

    it('yield NOT_SUPPORTED if active schema version is incompatible with target version', async () => {
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockResolvedValue(Realtime.SchemaVersion.V2);

      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V1 });

      await expectMigrationStates(migrator, [MigrationState.NOT_SUPPORTED]);
    });

    it('yield NOT_REQUIRED if no pending migrations exist based for version in database', async () => {
      const setActiveSchemaVersion = vi.fn();
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockResolvedValue(null);
      vi.spyOn(migrationCacheService, 'setActiveSchemaVersion').mockImplementation(setActiveSchemaVersion);

      const migrator = migrateService.migrateSchema({
        creatorID,
        version: { ...version, _version: Infinity },
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
    });

    it('yield NOT_ALLOWED if unable to acquire migration lock', async () => {
      const acquireMigrationLock = vi.fn().mockRejectedValue('error');
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockResolvedValue(null);
      vi.spyOn(migrationCacheService, 'acquireMigrationLock').mockImplementation(acquireMigrationLock);
      vi.spyOn(versionService, 'get').mockResolvedValue({ ...version, _version: Realtime.SchemaVersion.V1 });

      const migrator = migrateService.migrateSchema({
        creatorID,
        version: { ...version, _version: Realtime.SchemaVersion.V1 },
        clientNodeID,
        targetSchemaVersion: Realtime.SchemaVersion.V2,
      });

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(acquireMigrationLock).toBeCalledWith(versionID, clientNodeID);
    });

    it('reset migration lock when error encountered', async () => {
      const resetMigrationLock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockResolvedValue(null);
      vi.spyOn(migrationCacheService, 'acquireMigrationLock').mockReturnThis();
      vi.spyOn(migrationCacheService, 'resetMigrationLock').mockImplementation(resetMigrationLock);
      vi.spyOn(versionService, 'get').mockResolvedValue({ ...version, _version: Realtime.SchemaVersion.V1 });

      const migrator = migrateService.migrateSchema({ creatorID, version, clientNodeID, targetSchemaVersion: Realtime.SchemaVersion.V2 });
      const generator = migrator[Symbol.asyncIterator]();

      await expect(generator.next()).resolves.toEqual({ done: false, value: MigrationState.STARTED });
      await expect(generator.next()).rejects.toThrow();
      expect(resetMigrationLock).toBeCalledWith(versionID);
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

      const setActiveSchemaVersion = vi.fn().mockResolvedValue(undefined);
      const replaceResources = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(migrationCacheService, 'isMigrationLocked').mockResolvedValue(false);
      vi.spyOn(migrationCacheService, 'getActiveSchemaVersion').mockResolvedValue(null);
      vi.spyOn(migrationCacheService, 'acquireMigrationLock').mockReturnThis();
      vi.spyOn(migrationCacheService, 'setActiveSchemaVersion').mockImplementation(setActiveSchemaVersion);

      vi.spyOn(versionService, 'get').mockResolvedValue({ ...version, ...versionData });
      vi.spyOn(versionService, 'replaceResources').mockImplementation(replaceResources);

      vi.spyOn(diagramService, 'getAll').mockResolvedValue([
        {
          creatorID,
          versionID,
          _id: diagramID,
        } as any,
      ]);

      vi.spyOn(projectService, 'get').mockResolvedValue({
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
      expect(replaceResources).toBeCalledWith(
        versionID,
        {
          _version: targetSchemaVersion,
          name: 'bar',
          variables: ['first', 'second'],
          rootDiagramID: 'diagramID',
          platformData: {},
        },
        [[diagramID, {}]]
      );
    });
  });
});
