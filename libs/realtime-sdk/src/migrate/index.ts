/* eslint-disable no-param-reassign */
import * as Adapters from '@realtime-sdk/adapters';
import { EntityMigrationData } from '@realtime-sdk/models/CMS/Entity';
import { SchemaVersion } from '@realtime-sdk/types';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import { produce } from 'immer';

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

export const getPendingMigrations = (currentVersion: SchemaVersion, targetVersion: SchemaVersion): Migration[] => {
  return migrations.filter((migration) => migration.version > currentVersion && migration.version <= targetVersion);
};

export const migrateProject = (
  vf: {
    project: BaseModels.Project.Model<AnyRecord, AnyRecord>;
    version: BaseModels.Version.Model<any>;
    diagrams: BaseModels.Diagram.Model[];
  },
  cms: {
    entities: EntityMigrationData[];
  },
  targetSchemaVersion: SchemaVersion
): MigrationData => {
  const project = Adapters.projectAdapter.fromDB(vf.project, { members: [] });

  const currentSchemaVersion = vf.version._version ?? SchemaVersion.V1;
  const pendingMigrations = getPendingMigrations(currentSchemaVersion, targetSchemaVersion);

  const migrationContext: MigrationContext = { platform: project.platform, projectType: project.type };

  return produce<MigrationData>(
    {
      version: getVersionPatch(vf.version),
      diagrams: vf.diagrams.map(getDiagramPatch),
      entities: cms.entities,
    },
    (draft) => {
      pendingMigrations.forEach((migration) => migration.transform(draft, migrationContext));
      draft.version._version = targetSchemaVersion;
    }
  );
};
