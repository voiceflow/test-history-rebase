import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { expect } from 'chai';
import sinon from 'sinon';

import MigrateService from '@/services/migrate';
import { MigrationState } from '@/services/migrate/constants';

describe('Migrate service unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('migrateSchema()', () => {
    const creatorID = 123;
    const projectID = 'projectID';
    const versionID = 'versionID';
    const clientNodeID = 'clientID';
    const schemaVersion = Realtime.SchemaVersion.V2;

    const expectMigrationStates = async (migrator: AsyncIterable<MigrationState>, states: MigrationState[]) => {
      const generator = migrator[Symbol.asyncIterator]();

      // eslint-disable-next-line no-restricted-syntax
      for (const state of states) {
        // eslint-disable-next-line no-await-in-loop
        await expect(generator.next()).to.eventually.eql({ done: false, value: state });
      }

      await expect(generator.next()).to.eventually.eql({ done: true, value: undefined });
    };

    it('yield NOT_ALLOWED if migration in progress', async () => {
      const isMigrationLocked = sinon.stub().resolves(true);
      const migrateService = new MigrateService({} as any);
      migrateService.isMigrationLocked = isMigrationLocked;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, schemaVersion);

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(isMigrationLocked).to.be.calledWithExactly(versionID);
    });

    it('yield NOT_REQUIRED if active schema version already meets target version', async () => {
      const getActiveSchemaVersion = sinon.stub().resolves(Realtime.SchemaVersion.V1);
      const migrateService = new MigrateService({} as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = getActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(getActiveSchemaVersion).to.be.calledWithExactly(versionID);
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
            get: sinon.stub().resolves(version),
          },
        },
      };
      const setActiveSchemaVersion = sinon.spy();
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.setActiveSchemaVersion = setActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_REQUIRED]);
      expect(setActiveSchemaVersion).to.be.calledWithExactly(versionID, version._version);
    });

    it('yield NOT_ALLOWED if unable to acquire migration lock', async () => {
      const options = {
        services: {
          version: {
            get: sinon.stub().resolves({ _version: Realtime.SchemaVersion.V1 }),
          },
        },
      };
      const acquireMigrationLock = sinon.stub().rejects();
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = acquireMigrationLock;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);

      await expectMigrationStates(migrator, [MigrationState.NOT_ALLOWED]);
      expect(acquireMigrationLock).to.be.calledWithExactly(versionID, clientNodeID);
    });

    it('reset migration lock when error encountered', async () => {
      const options = {
        services: {
          version: {
            get: sinon.stub().resolves({ _version: Realtime.SchemaVersion.V1 }),
          },
        },
      };
      const resetMigrationLock = sinon.stub().resolves();
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = () => Promise.resolve();
      migrateService.resetMigrationLock = resetMigrationLock;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, Realtime.SchemaVersion.V2);
      const generator = migrator[Symbol.asyncIterator]();

      await expect(generator.next()).to.eventually.eql({ done: false, value: MigrationState.STARTED });
      await expect(generator.next()).to.be.rejected;
      expect(resetMigrationLock).to.be.calledWithExactly(versionID);
    });

    it('perform migrations on resources and save them back to the database', async () => {
      const diagramID = 'diagramID';
      const targetSchemaVersion = Realtime.SchemaVersion.V1;
      const options = {
        services: {
          project: {
            get: sinon.stub().resolves({ type: VoiceflowConstants.ProjectType.CHAT, platform: VoiceflowConstants.PlatformType.VOICEFLOW }),
          },
          version: {
            get: sinon.stub().resolves({
              creatorID,
              projectID,
              _id: versionID,
              _version: 0,
              platformData: { fizz: 'buzz' },
              variables: ['first', 'second'],
              name: 'bar',
              rootDiagramID: 'diagramID',
            }),
            replaceResources: sinon.stub().resolves(),
          },
          diagram: {
            getAll: sinon.stub().resolves([
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
      const setActiveSchemaVersion = sinon.stub().resolves();
      const migrateService = new MigrateService(options as any);
      migrateService.isMigrationLocked = async () => false;
      migrateService.getActiveSchemaVersion = async () => null;
      migrateService.acquireMigrationLock = () => Promise.resolve();
      migrateService.setActiveSchemaVersion = setActiveSchemaVersion;

      const migrator = migrateService.migrateSchema(creatorID, projectID, versionID, clientNodeID, targetSchemaVersion);

      await expectMigrationStates(migrator, [MigrationState.STARTED, MigrationState.DONE]);
      expect(setActiveSchemaVersion).to.be.calledWithExactly(versionID, targetSchemaVersion);
      expect(options.services.version.replaceResources).to.be.calledWithExactly(
        creatorID,
        versionID,
        {
          _version: targetSchemaVersion,
          variables: ['first', 'second'],
          name: 'bar',
          topics: undefined,
          folders: undefined,
          components: undefined,
          rootDiagramID: 'diagramID',
          platformData: { fizz: 'buzz' },
          topics: undefined,
          domains: undefined,
          components: undefined,
          folders: undefined,
        },
        [{ _id: diagramID, foo: 'bar' }]
      );
    });
  });
});
