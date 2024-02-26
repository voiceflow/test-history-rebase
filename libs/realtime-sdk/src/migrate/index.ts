/* eslint-disable no-param-reassign */
import * as Adapters from '@realtime-sdk/adapters';
import { SchemaVersion } from '@realtime-sdk/schema-version/schema-version.enum';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import { produceWithPatches } from 'immer';

import migrations from './migrations';
import { DiagramUpdateData, Migration, MigrationContext, MigrationData, VersionUpdateData } from './migrations/types';

export * from './migrations/types';

const getVersionPatch = (version: BaseVersion.Version): VersionUpdateData => {
  return Utils.object.pick(version, [
    '_version',
    'name',
    'variables',
    'rootDiagramID',
    'platformData',
    'topics',
    'domains',
    'components',
    'templateDiagramID',
    'folders',
  ]);
};

const getDiagramPatch = (diagram: BaseModels.Diagram.Model): DiagramUpdateData => {
  return Utils.object.omit(diagram, ['creatorID', 'versionID']);
};

export const getPendingMigrations = (currentVersion: number, targetVersion: SchemaVersion): Migration[] => {
  return migrations.filter((migration) => migration.version > currentVersion && migration.version <= targetVersion);
};

interface MigrateProjectPayload {
  cms: MigrationData['cms'];
  version: BaseModels.Version.Model<any>;
  project: BaseModels.Project.Model<AnyRecord, AnyRecord>;
  diagrams: BaseModels.Diagram.Model[];
  creatorID: number;
}

export const migrateProject = ({ cms, version, project, diagrams, creatorID }: MigrateProjectPayload, targetSchemaVersion: SchemaVersion) => {
  const currentSchemaVersion = version._version ?? SchemaVersion.V1;
  const pendingMigrations = getPendingMigrations(currentSchemaVersion, targetSchemaVersion);

  const migrationContext: MigrationContext = {
    project: Adapters.projectAdapter.fromDB(project, { members: [] }),
    creatorID,
  };

  return produceWithPatches<MigrationData>(
    {
      cms,
      version: getVersionPatch(version),
      diagrams: diagrams.map(getDiagramPatch),
    },
    (draft) => {
      pendingMigrations.forEach((migration) => migration.transform(draft, migrationContext));
      draft.version._version = targetSchemaVersion;
    }
  );
};
