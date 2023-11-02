/* eslint-disable max-params */
import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import { HashedIDService, UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import {
  ObjectId,
  ProjectEntity,
  ProjectJSONAdapter,
  ProjectORM,
  VersionIntentORM,
  VersionJSONAdapter,
  VersionSlotORM,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { MutableService } from '@/common';
import { CreatorService } from '@/creator/creator.service';
import { DiagramService } from '@/diagram/diagram.service';
import { ProjectListService } from '@/project-list/project-list.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { ProjectsMerge } from '@/utils/projects-merge.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionService } from '@/version/version.service';

import { ProjectImportJSONRequest } from './dtos/project-import-json-request.dto';
import { LegacyProjectSerializer } from './legacy/legacy-project.serializer';

@Injectable()
export class ProjectService extends MutableService<ProjectORM> {
  constructor(
    @Inject(ProjectORM)
    protected readonly orm: ProjectORM,
    @Inject(VersionSlotORM)
    private readonly versionSlotORM: VersionSlotORM,
    @Inject(VersionIntentORM)
    private readonly versionIntentORM: VersionIntentORM,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(CreatorService)
    private readonly creator: CreatorService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(DiagramService)
    private readonly diagram: DiagramService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(VariableStateService)
    private readonly variableState: VariableStateService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleashFeatureFlag: UnleashFeatureFlagService,
    @Inject(LegacyProjectSerializer)
    private readonly legacyProjectSerializer: LegacyProjectSerializer
  ) {
    super();
  }

  static cleanupImportData(
    creatorID: number,
    { project, version, ...data }: ProjectImportJSONRequest['data'],
    { settingsAiAssist }: { settingsAiAssist: boolean }
  ) {
    const newVersion = { ...version };
    const newProject = Utils.object.omit(ProjectJSONAdapter.fromDB(deepSetCreatorID(deepSetNewDate({ ...new ProjectEntity(project) }), creatorID)), [
      '_id',
      'id',
      'createdAt',
      'liveVersion',
    ]);

    if (!settingsAiAssist) {
      newProject.aiAssistSettings = { ...newProject.aiAssistSettings, aiPlayground: false };
    }

    if (newVersion.prototype && Utils.object.isObject(newVersion.prototype) && Utils.object.isObject(newVersion.prototype.settings)) {
      delete newVersion.prototype.settings.variableStateID;
    }

    return {
      ...data,
      project: newProject,
      version: newVersion,
    };
  }

  public async getLegacy(creatorID: number, projectID: string) {
    if (!this.creator) throw new Error('no client found');
    const client = await this.creator?.getClientByUserID(creatorID);
    return client.project.get(projectID);
  }

  public async patchPlatformDataLegacy(creatorID: number, projectID: string, data: Partial<AnyRecord>): Promise<void> {
    const client = await this.creator.getClientByUserID(creatorID);
    await client.project.updatePlatformData(projectID, data);
  }

  private async importJSON({
    data,
    creatorID,
    workspaceID,
    workspaceProperties,
  }: {
    data: ProjectImportJSONRequest['data'];
    creatorID: number;
    workspaceID: number;
    workspaceProperties: { settingsAiAssist: boolean };
  }) {
    const cleanedData = ProjectService.cleanupImportData(creatorID, data, workspaceProperties);

    const newProjectID = new ObjectId().toJSON();
    const newVersionID = new ObjectId().toJSON();

    const [variableStates, { version, diagrams }, project] = await Promise.all([
      cleanedData.variableStates?.length ? this.variableState.createMany(cleanedData.variableStates, { flush: false }) : Promise.resolve([]),

      this.version.importOneJSON(
        {
          creatorID,
          sourceVersion: cleanedData.version,
          sourceDiagrams: Object.values(cleanedData.diagrams),
          sourceVersionOverride: { _id: newVersionID, projectID: newProjectID },
        },
        { flush: false }
      ),

      this.createOne(
        {
          ...cleanedData.project,
          _id: newProjectID,
          teamID: workspaceID,
          privacy: 'private',
          members: [],
          updatedBy: creatorID,
          creatorID,
          updatedAt: new Date().toJSON(),
          apiPrivacy: 'private',
          devVersion: newVersionID,
        },
        { flush: false }
      ),
    ]);

    await this.orm.em.flush();

    return {
      project,
      version,
      diagrams,
      variableStates,
    };
  }

  public async importJSONAndBroadcast({
    data,
    clientID,
    creatorID,
    workspaceID,
  }: {
    data: ProjectImportJSONRequest['data'];
    clientID?: string;
    creatorID: number;
    workspaceID: number;
  }) {
    const hashedWorkspaceID = this.hashedID.encodeWorkspaceID(workspaceID);

    const workspaceProperties = await this.identityClient.workspaceProperty
      .findAllPropertiesByWorkspaceID(this.hashedID.encodeWorkspaceID(workspaceID))
      .catch(() => ({ settingsAiAssist: true, settingsDashboardKanban: true }));

    const { project } = await this.importJSON({ data, creatorID, workspaceID, workspaceProperties });

    if (!clientID) {
      return project;
    }

    const authMeta = { userID: creatorID, clientID };

    await this.logux.processAs(
      Realtime.project.crud.add({ key: project.id, value: this.legacyProjectSerializer.nullable(project), workspaceID: hashedWorkspaceID }),
      authMeta
    );

    // do nothing if the workspace is using the new dashboard
    if (!workspaceProperties.settingsDashboardKanban) {
      return project;
    }

    let defaultList = await this.projectList.getDefaultList(workspaceID);

    if (!defaultList) {
      defaultList = { name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [], board_id: Utils.id.cuid() };

      await this.logux.processAs(
        Realtime.projectList.crud.add({
          key: defaultList.board_id,
          value: { id: defaultList.board_id, ...defaultList },
          workspaceID: hashedWorkspaceID,
        }),
        authMeta
      );
    }

    await this.logux.processAs(
      Realtime.projectList.addProjectToList({ projectID: project.id, listID: defaultList.board_id, workspaceID: hashedWorkspaceID }),
      authMeta
    );

    return project;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async merge({ payload, authMeta }: { payload: Realtime.project.MergeProjectsPayload; authMeta: AuthMetaPayload }) {
    const { workspaceID, sourceProjectID, targetProjectID } = payload;

    const [sourceProject, targetProject] = await Promise.all([this.findOneOrFail(sourceProjectID), this.findOneOrFail(targetProjectID)]);

    if (!sourceProject.devVersion || !targetProject.devVersion) throw new Error('no dev version found');

    let negotiateAction = Realtime.version.schema.legacyNegotiate.started;

    if (
      this.unleashFeatureFlag.isEnabled(Realtime.FeatureFlag.MIGRATION_V2, {
        userID: authMeta.userID,
        workspaceID: this.hashedID.decodeWorkspaceID(workspaceID),
      })
    ) {
      negotiateAction = Realtime.version.schema.negotiate.started;
    }

    // migrating projects to the latest version before merging
    await Promise.all([
      this.logux.processAs(
        negotiateAction({ versionID: sourceProject.devVersion.toJSON(), proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }),
        authMeta
      ),
      this.logux.processAs(
        negotiateAction({ versionID: targetProject.devVersion.toJSON(), proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }),
        authMeta
      ),
    ]);

    const [sourceVersion, targetVersion, sourceDiagrams] = await Promise.all([
      this.version.findOneOrFail(sourceProject.devVersion.toJSON()),
      this.version.findOneOrFail(targetProject.devVersion.toJSON()),
      this.diagram.findManyByVersionID(sourceProject.devVersion.toJSON()),
    ]);

    const {
      nlu: targetNLU,
      type: targetProjectType,
      platform: targetProjectPlatform,
    } = Realtime.Adapters.projectAdapter.fromDB(targetProject as any, { members: [] });

    const targetProjectConfig = Platform.Config.getTypeConfig({ type: targetProjectType, platform: targetProjectPlatform });

    const projectsMerge = new ProjectsMerge({
      creatorID: authMeta.userID,
      targetProject,
      targetVersion,
      sourceProject,
      sourceVersion,
      sourceDiagrams,
    });

    const { newNotes, newFolders, newDomains, newProducts, newDiagrams, mergedSlots, newVariables, mergedIntents, newComponents, newCustomThemes } =
      projectsMerge.perform();

    const hasNewNotes = !!Object.keys(newNotes).length;
    const hasNewDomains = !!newDomains.length;
    const hasNewFolders = !!Object.keys(newFolders).length;
    const hasNewProducts = !!Object.keys(newProducts).length;
    const hasMergedSlots = !!mergedSlots.length;
    const hasNewDiagrams = !!newDiagrams.length;
    const hasNewVariables = !!newVariables.length;
    const hasNewComponents = !!newComponents.length;
    const hasMergedIntents = !!mergedIntents.length;
    const hasNewCustomThemes = !!newCustomThemes.length;

    // creating a new version before save merged data
    const client = await this.creator.getClientByUserID(authMeta.userID);
    await client.version.snapshot(targetVersion.id, {
      name: `merge [${sourceProject.name}] into [${targetProject.name}] backup`,
      manualSave: true,
    });

    // storing merged data into the DB
    await Promise.all<unknown>([
      hasNewCustomThemes &&
        this.patchOne(targetProjectID, {
          customThemes: [...(targetProject.customThemes ?? []), ...newCustomThemes],
          updatedAt: new Date().toJSON(),
          updatedBy: authMeta.userID,
        }),

      hasNewProducts &&
        this.orm.patchOnePlatformData(targetProjectID, {
          products: { ...targetProject.platformData.products, ...newProducts },
        }),

      (hasNewNotes || hasNewDomains || hasNewFolders || hasNewComponents) &&
        this.version.patchOne(
          targetVersion._id,
          VersionJSONAdapter.fromDB({
            ...(hasNewNotes && { notes: { ...targetVersion.notes, ...newNotes } }),
            ...(hasNewDomains && { domains: [...(targetVersion.domains ?? []), ...newDomains] }),
            ...(hasNewFolders && { folders: { ...targetVersion.folders, ...newFolders } }),
            ...(hasNewVariables && { variables: [...(targetVersion.variables ?? []), ...newVariables] }),
            ...(hasNewComponents && { components: [...(targetVersion.components ?? []), ...newComponents] }),
          })
        ),

      hasMergedSlots && this.versionSlotORM.setAll(targetVersion.id, mergedSlots),

      hasMergedIntents && this.versionIntentORM.setAll(targetVersion.id, mergedIntents),

      hasNewDiagrams && this.diagram.createMany(newDiagrams),
    ]);

    const actionContext = {
      projectID: targetProjectID,
      versionID: targetVersion.id,
      workspaceID,
    };

    const sharedNodes = DiagramService.getAllSharedNodes(newDiagrams);

    await Promise.all<unknown>([
      this.logux.processAs(Realtime.diagram.sharedNodes.reload({ ...actionContext, sharedNodes }), authMeta),

      hasNewCustomThemes &&
        this.logux.processAs(
          Realtime.project.addManyCustomThemes({ ...actionContext, values: [...(targetProject.customThemes ?? []), ...newCustomThemes] }),
          authMeta
        ),

      hasNewProducts &&
        this.logux.processAs(
          Realtime.product.crud.addMany({ ...actionContext, values: Realtime.Adapters.productAdapter.mapFromDB(Object.values(newProducts)) }),
          authMeta
        ),

      hasNewNotes &&
        this.logux.processAs(
          Realtime.note.addMany({
            ...actionContext,
            values: Realtime.Adapters.noteAdapter.mapFromDB(Object.values(newNotes) as BaseModels.AnyNote[]),
          }),
          authMeta
        ),

      hasNewVariables &&
        this.logux.processAs(
          Realtime.version.variable.reloadGlobal({ ...actionContext, variables: [...(targetVersion.variables ?? []), ...newVariables] }),
          authMeta
        ),

      hasMergedSlots &&
        this.logux.processAs(Realtime.slot.reload({ ...actionContext, slots: Realtime.Adapters.slotAdapter.mapFromDB(mergedSlots) }), authMeta),

      hasMergedIntents &&
        this.logux.processAs(
          Realtime.intent.reload({
            ...actionContext,
            intents: targetProjectConfig.adapters.intent.smart.mapFromDB(mergedIntents),
            projectMeta: { nlu: targetNLU, type: targetProjectType, platform: targetProjectPlatform },
          }),
          authMeta
        ),

      hasNewDiagrams &&
        this.logux.processAs(
          Realtime.diagram.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.diagramAdapter.mapFromDB(newDiagrams, { rootDiagramID: targetVersion.rootDiagramID.toJSON() }),
          }),
          authMeta
        ),

      hasNewFolders &&
        this.logux.processAs(
          Realtime.version.reloadFolders({
            ...actionContext,
            folders: { ...targetVersion.folders, ...newFolders } as Record<string, BaseModels.Version.Folder>,
          }),
          authMeta
        ),

      hasNewComponents &&
        this.logux.processAs(
          Realtime.version.addManyComponents({ ...actionContext, components: newComponents as BaseModels.Version.FolderItem[] }),
          authMeta
        ),

      hasNewDomains &&
        this.logux.processAs(
          Realtime.domain.crud.addMany({
            ...actionContext,
            values: Realtime.Adapters.domainAdapter.mapFromDB(newDomains as BaseModels.Version.Domain[]),
          }),
          authMeta
        ),
    ]);
  }
}
