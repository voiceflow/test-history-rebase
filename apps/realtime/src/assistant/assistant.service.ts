/* eslint-disable max-params */
import fs from 'node:fs/promises';

import { EntityManager } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { ProjectUserRole } from '@voiceflow/dtos';
import { BadRequestException, InternalServerErrorException } from '@voiceflow/exception';
import { AuthMetaPayload, LoguxService } from '@voiceflow/nestjs-logux';
import type { AssistantEntity, AssistantObject, CreateData, ProgramJSON } from '@voiceflow/orm-designer';
import {
  AssistantORM,
  DatabaseTarget,
  DiagramObject,
  ObjectId,
  ProgramObject,
  ProjectJSON,
  ProjectObject,
  PrototypeProgramObject,
  VariableStateObject,
  VersionJSON,
  VersionObject,
} from '@voiceflow/orm-designer';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { Patch } from 'immer';
import _ from 'lodash';

import { MutableService } from '@/common';
import { EnvironmentCMSData } from '@/environment/environment.interface';
import { EnvironmentService } from '@/environment/environment.service';
import { ProgramService } from '@/program/program.service';
import { LATEST_PROJECT_VERSION } from '@/project/project.constant';
import { ProjectSerializer } from '@/project/project.serializer';
import { ProjectService } from '@/project/project.service';
import { LegacyProjectSerializer } from '@/project/project-legacy/legacy-project.serializer';
import { ProjectListService } from '@/project-list/project-list.service';
import { PrototypeProgramService } from '@/prototype-program/prototype-program.service';
import { deepSetCreatorID } from '@/utils/creator.util';
import { deepSetNewDate } from '@/utils/date.util';
import { VariableStateService } from '@/variable-state/variable-state.service';
import { VersionIDAlias } from '@/version/version.constant';
import { VersionService } from '@/version/version.service';

import { CreateFromTemplateData } from './assistant.interface';
import { AssistantSerializer } from './assistant.serializer';
import {
  adjustCMSTabularEntitiesUpdatedFieldsMap,
  buildCMSTabularEntitiesUpdatedFieldsMap,
  updateCMSTabularResourcesWithUpdatedFields,
} from './assistant.util';
import { AssistantExportDataDTO } from './dtos/assistant-export-data.dto';
import { AssistantImportDataDTO } from './dtos/assistant-import-data.dto';

@Injectable()
export class AssistantService extends MutableService<AssistantORM> {
  private readonly logger = new Logger(AssistantService.name);

  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,

    @Inject(AssistantORM)
    protected readonly orm: AssistantORM,

    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(LoguxService)
    private readonly logux: LoguxService,
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(ProgramService)
    private readonly program: ProgramService,
    @Inject(VersionService)
    private readonly version: VersionService,
    @Inject(EnvironmentService)
    private readonly environment: EnvironmentService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(VariableStateService)
    private readonly variableState: VariableStateService,
    @Inject(PrototypeProgramService)
    private readonly prototypeProgram: PrototypeProgramService,
    @Inject(ProjectSerializer)
    private readonly projectSerializer: ProjectSerializer,
    @Inject(AssistantSerializer)
    private readonly assistantSerializer: AssistantSerializer,
    @Inject(LegacyProjectSerializer)
    private readonly legacyProjectSerializer: LegacyProjectSerializer
  ) {
    super();
  }

  /* Helpers  */

  private async resolveEnvironmentIDAlias(environmentID: string, assistantID?: string) {
    const VERSION_ID_ALIAS_SET = new Set<string>(Object.values(VersionIDAlias));

    if (!VERSION_ID_ALIAS_SET.has(environmentID)) {
      return environmentID;
    }

    if (!assistantID) {
      throw new BadRequestException(`Could not resolve '${environmentID}' environment alias. The "assistantID" is not provided.`);
    }

    const project = await this.project.findOneOrFail(assistantID);

    const resolvedVersionID = environmentID === VersionIDAlias.PRODUCTION ? project.liveVersion?.toString() : project.devVersion?.toString();

    if (!resolvedVersionID) {
      throw new InternalServerErrorException(`Could not resolve '${environmentID}' environment alias. There is no environment under that alias.`);
    }

    return resolvedVersionID;
  }

  private fetchWorkspacePropertiesWithDefaults(workspaceID: number) {
    return this.identityClient.private
      .findAllPropertiesByWorkspaceID(this.projectSerializer.encodeWorkspaceID(workspaceID))
      .catch(() => ({ settingsAiAssist: true, settingsDashboardKanban: true }));
  }

  private async addOneToProjectListIfRequired({
    workspaceID,
    assistantID,
    projectListID,
    workspaceProperties: workspacePropertiesProp,
  }: {
    workspaceID: number;
    assistantID: string;
    projectListID?: string | null;
    workspaceProperties?: { settingsDashboardKanban: boolean };
  }) {
    try {
      const workspaceProperties = workspacePropertiesProp ?? (await this.fetchWorkspacePropertiesWithDefaults(workspaceID));

      let projectList: Realtime.DBProjectList | null = null;
      let projectListCreated = false;

      if (workspaceProperties.settingsDashboardKanban) {
        ({ projectList, projectListCreated } = await this.projectList.acquireList(workspaceID, projectListID));

        projectList = await this.projectList.addProjectToList(workspaceID, projectList.board_id, assistantID);
      }

      return {
        projectList,
        projectListCreated,
      };
    } catch {
      return {
        projectList: null,
        projectListCreated: false,
      };
    }
  }

  /* Find  */

  public async findManyByWorkspace(workspaceID: number) {
    return this.orm.findManyByWorkspace(workspaceID);
  }

  public async findOneCMSData(assistantID: string, environmentID: string) {
    // using transaction to optimize connections
    return this.postgresEM.transactional(async () => {
      const [assistant, cmsData] = await Promise.all([this.findOneOrFail(assistantID), this.environment.findOneCMSData(environmentID)]);

      return {
        ...cmsData,
        assistant,
      };
    });
  }

  toJSONCMSData(data: EnvironmentCMSData & { assistant: AssistantObject }) {
    return {
      ...this.environment.toJSONCMSData(data),
      assistant: this.assistantSerializer.nullable(data.assistant),
    };
  }

  /* Import  */

  prepareImportData(
    data: AssistantImportDataDTO,
    {
      userID,
      backup,
      assistantID,
      workspaceID,
      environmentID,
      centerDiagrams,
      settingsAiAssist,
    }: {
      userID: number;
      backup?: boolean;
      workspaceID: number;
      assistantID: string;
      environmentID: string;
      centerDiagrams?: boolean;
      settingsAiAssist: boolean;
    }
  ) {
    const createdAt = new Date().toJSON();

    const project = {
      ...Utils.object.omit(deepSetCreatorID(deepSetNewDate(data.project), userID), ['prototype', 'createdAt', 'liveVersion', 'previewVersion']),
      _id: assistantID,
      teamID: workspaceID,
      privacy: 'private' as const,
      members: [],
      updatedBy: userID,
      creatorID: userID,
      updatedAt: createdAt,
      apiPrivacy: 'private' as const,
      devVersion: environmentID,
    };

    if (project.knowledgeBase?.documents) {
      project.knowledgeBase.documents = {};
    }

    if (project.knowledgeBase?.faqSets) {
      project.knowledgeBase.faqSets = {};
    }

    if (project.knowledgeBase?.tags) {
      project.knowledgeBase.tags = {};
    }

    if (!settingsAiAssist) {
      project.aiAssistSettings = { ...project.aiAssistSettings, aiPlayground: false };
    }

    const importData = this.environment.prepareImportData(data, { userID, backup, assistantID, workspaceID, environmentID, centerDiagrams });

    return {
      ...importData,
      project,
      _version: data._version,
      variableStates: data.variableStates?.map((variableState) => ({ ...Utils.object.omit(variableState, ['_id']), projectID: assistantID })),
    };
  }

  public async importJSON({
    data,
    userID,
    workspaceID,
    projectListID,
    centerDiagrams,
    projectOverride = {},
  }: {
    data: AssistantImportDataDTO;
    userID: number;
    workspaceID: number;
    projectListID?: string | null;
    centerDiagrams?: boolean;
    projectOverride?: Partial<Omit<ProjectJSON, '_id' | 'teamID'>>;
  }) {
    const workspaceProperties = await this.fetchWorkspacePropertiesWithDefaults(workspaceID);

    const assistantID = new ObjectId().toJSON();
    const environmentID = new ObjectId().toJSON();

    const importData = this.prepareImportData(data, {
      userID,
      workspaceID,
      assistantID,
      environmentID,
      centerDiagrams,
      settingsAiAssist: workspaceProperties.settingsAiAssist,
    });

    const project = await this.project.createOne(this.project.fromJSON({ ...importData.project, ...projectOverride }));

    let assistant: AssistantObject;

    try {
      assistant = await this.createOne({
        id: assistantID,
        name: project.name,
        updatedByID: userID,
        workspaceID,
        activePersonaID: null,
        activeEnvironmentID: environmentID,
      });
    } catch (err) {
      this.logger.error(err);

      await this.project.deleteOne(project._id.toJSON());

      throw new InternalServerErrorException(`Couldn't import the assistant.`);
    }

    let version: VersionObject;
    let diagrams: DiagramObject[];

    try {
      ({ version, diagrams } = await this.environment.importJSON({
        data: importData,
        userID,
        workspaceID,
        assistantID,
        environmentID,
      }));
    } catch (err) {
      this.logger.error(err);

      await this.deleteOne(assistant.id);
      await this.project.deleteOne(project._id.toJSON());

      throw new InternalServerErrorException(`Couldn't import the assistant.`);
    }

    let variableStates: VariableStateObject[];

    try {
      variableStates = await (importData.variableStates?.length
        ? this.variableState.createMany(this.variableState.mapFromJSON(importData.variableStates))
        : Promise.resolve([]));
    } catch (err) {
      this.logger.error(err);

      await this.environment.deleteOne(version._id.toJSON());
      await this.deleteOne(assistant.id);
      await this.project.deleteOne(project._id.toJSON());

      throw new InternalServerErrorException(`Couldn't import the assistant.`);
    }

    const { projectList, projectListCreated } = await this.addOneToProjectListIfRequired({
      workspaceID,
      assistantID,
      projectListID,
      workspaceProperties,
    });

    return {
      project,
      version,
      diagrams,
      assistant,
      projectList,
      variableStates,
      projectListCreated,
    };
  }

  public async broadcastAddOne({
    project,
    authMeta,
    assistant,
    projectList,
    projectMembers = [],
    projectListCreated,
  }: {
    project: ProjectObject;
    authMeta: AuthMetaPayload;
    assistant: AssistantObject | null;
    projectList: Realtime.DBProjectList | null;
    projectMembers?: Array<{ role: ProjectUserRole; creatorID: number }>;
    projectListCreated: boolean;
  }) {
    const legacyProject = this.legacyProjectSerializer.serialize(project, projectMembers);

    await Promise.all([
      ...(assistant
        ? [
            this.logux.processAs(
              Actions.Assistant.AddOne({
                data: this.assistantSerializer.nullable(assistant),
                context: { workspaceID: legacyProject.workspaceID, broadcastOnly: true },
              }),
              authMeta
            ),
          ]
        : []),

      this.logux.processAs(
        Realtime.project.crud.add({
          key: legacyProject.id,
          value: legacyProject,
          context: { broadcastOnly: true },
          workspaceID: legacyProject.workspaceID,
        }),
        authMeta
      ),

      ...(projectList
        ? [
            projectListCreated
              ? this.logux.processAs(
                  Realtime.projectList.crud.add({
                    key: projectList.board_id,
                    value: { id: projectList.board_id, ...projectList },
                    context: { broadcastOnly: true },
                    workspaceID: legacyProject.workspaceID,
                  }),
                  authMeta
                )
              : this.logux.processAs(
                  Realtime.projectList.addProjectToList({
                    listID: projectList.board_id,
                    context: { broadcastOnly: true },
                    projectID: legacyProject.id,
                    workspaceID: legacyProject.workspaceID,
                  }),
                  authMeta
                ),
          ]
        : []),
    ]);
  }

  public async importJSONAndBroadcast({
    data,
    userID,
    clientID,
    workspaceID,
  }: {
    data: AssistantImportDataDTO;
    userID: number;
    clientID?: string;
    workspaceID: number;
  }) {
    const { project, assistant, projectList, projectListCreated } = await this.importJSON({ data, userID, workspaceID });

    if (!clientID) {
      return { project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { project, assistant };
  }

  /* Export  */

  private prepareExportData(
    data: {
      cms: EnvironmentCMSData;
      project: ProjectObject;
      version: VersionObject;
      diagrams: DiagramObject[];
      programs: ProgramObject[];
      _version: number;
      variableStates: VariableStateObject[];
      prototypePrograms: PrototypeProgramObject[];
    },
    {
      userID,
      backup,
      withPrograms,
      centerDiagrams = true,
      withPrototypePrograms,
    }: {
      userID: number;
      backup?: boolean;
      withPrograms?: boolean;
      centerDiagrams?: boolean;
      withPrototypePrograms?: boolean;
    }
  ): AssistantExportDataDTO {
    const project = this.projectSerializer.serialize(data.project);

    // members and previewVersion are private data
    project.members = [];
    project.previewVersion = undefined;

    const exportData = this.environment.prepareExportData(data, { backup, userID, workspaceID: data.project.teamID, centerDiagrams });

    const buildProgramsRecord = (programs: ProgramJSON[]) =>
      Object.fromEntries(programs.map((program) => [program.diagramID, { ...program, _id: program.diagramID }]));

    let programs: Record<string, ProgramJSON> | undefined;

    if (withPrograms) {
      programs = buildProgramsRecord(this.program.mapToJSON(data.programs));
    } else if (withPrototypePrograms) {
      programs = buildProgramsRecord(this.prototypeProgram.mapToJSON(data.prototypePrograms));
    }

    return {
      ...exportData,
      project,
      programs,
      _version: String(data._version),
      variableStates: this.variableState.mapToJSON(data.variableStates),
    };
  }

  public async exportJSON({
    userID,
    backup,
    programs: withPrograms,
    assistantID,
    environmentID,
    centerDiagrams,
    prototypePrograms: withPrototypePrograms,
  }: {
    userID: number;
    backup?: boolean;
    programs?: boolean;
    assistantID?: string;
    environmentID: string;
    centerDiagrams?: boolean;
    prototypePrograms?: boolean;
  }) {
    return this.postgresEM.transactional(async () => {
      const resolvedEnvironmentID = await this.resolveEnvironmentIDAlias(environmentID, assistantID);
      const { projectID } = await this.version.findOneOrFailWithFields(resolvedEnvironmentID, ['projectID']);

      const [project, variableStates] = await Promise.all([
        this.project.findOneOrFail(projectID.toJSON()),
        this.variableState.findManyByProject(projectID.toJSON()),
      ]);

      const { cms, version, diagrams } = await this.environment.exportJSON({
        userID,
        workspaceID: project.teamID,
        environmentID: resolvedEnvironmentID,
      });

      const diagramIDs = diagrams.map((diagram) => diagram.diagramID);
      diagramIDs.push(version._id);

      const [programs, prototypePrograms] = await Promise.all([
        withPrograms ? await this.program.findManyByVersionAndDiagramIDs(version._id, diagramIDs) : Promise.resolve([]),
        withPrototypePrograms ? await this.prototypeProgram.findManyByVersionAndDiagramIDs(version._id, diagramIDs) : Promise.resolve([]),
      ]);

      const exportVersion = project._version ?? LATEST_PROJECT_VERSION;

      return this.prepareExportData(
        {
          cms,
          project,
          version,
          diagrams,
          programs,
          _version: exportVersion,
          variableStates,
          prototypePrograms,
        },
        {
          backup,
          userID,
          withPrograms,
          centerDiagrams,
          withPrototypePrograms,
        }
      );
    });
  }

  public exportCMS({ userID, assistantID, environmentID }: { userID: number; assistantID?: string; environmentID: string }) {
    return this.postgresEM.transactional(async () => {
      const resolvedEnvironmentID = await this.resolveEnvironmentIDAlias(environmentID, assistantID);
      const { projectID } = await this.version.findOneOrFailWithFields(resolvedEnvironmentID, ['projectID']);
      const { teamID: workspaceID } = await this.project.findOneOrFailWithFields(projectID, ['teamID']);

      const [assistant, cmsData] = await Promise.all([this.findOneOrFail(projectID.toJSON()), this.environment.findOneCMSData(environmentID)]);

      const intentsUpdatedFieldsMap = buildCMSTabularEntitiesUpdatedFieldsMap(cmsData.intents);
      adjustCMSTabularEntitiesUpdatedFieldsMap(intentsUpdatedFieldsMap, cmsData.utterances, (utterance) => utterance.intentID);
      adjustCMSTabularEntitiesUpdatedFieldsMap(intentsUpdatedFieldsMap, cmsData.requiredEntities, (utterance) => utterance.intentID);

      const entitiesUpdatedFieldsMap = buildCMSTabularEntitiesUpdatedFieldsMap(cmsData.entities);
      adjustCMSTabularEntitiesUpdatedFieldsMap(entitiesUpdatedFieldsMap, cmsData.entityVariants, (entityVariant) => entityVariant.entityID);

      const functionsUpdatedFieldsMap = buildCMSTabularEntitiesUpdatedFieldsMap(cmsData.functions);
      adjustCMSTabularEntitiesUpdatedFieldsMap(functionsUpdatedFieldsMap, cmsData.functionPaths, (functionPath) => functionPath.functionID);
      adjustCMSTabularEntitiesUpdatedFieldsMap(
        functionsUpdatedFieldsMap,
        cmsData.functionVariables,
        (functionVariable) => functionVariable.functionID
      );

      const exportData = this.environment.prepareExportCMSData(cmsData, { userID, workspaceID });

      return {
        ...exportData,
        intents: updateCMSTabularResourcesWithUpdatedFields(intentsUpdatedFieldsMap, exportData.intents),
        entities: updateCMSTabularResourcesWithUpdatedFields(entitiesUpdatedFieldsMap, exportData.entities),
        functions: updateCMSTabularResourcesWithUpdatedFields(functionsUpdatedFieldsMap, exportData.functions ?? []),
        assistant: this.assistantSerializer.nullable(assistant),
      };
    });
  }

  /* Create  */

  public async createOneForLegacyProject(workspaceID: string, projectID: string, data: Omit<CreateData<AssistantEntity>, 'workspaceID'>) {
    const assistant = await this.orm.createOne({ ...data, id: projectID, workspaceID: this.assistantSerializer.decodeWorkspaceID(workspaceID) });

    return this.assistantSerializer.nullable(assistant);
  }

  /* Clone  */

  public async cloneOne({
    userID,
    sourceAssistantID,
    targetAssistantID,
    targetWorkspaceID,
    targetProjectListID,
    targetVersionOverride = {},
    targetProjectOverride = {},
  }: {
    userID: number;
    sourceAssistantID: string;
    targetWorkspaceID: number;
    targetAssistantID?: string;
    targetProjectListID?: string | null;
    targetVersionOverride?: Partial<Omit<VersionJSON, 'id'>>;
    targetProjectOverride?: Partial<Omit<ProjectJSON, 'id' | '_id' | 'teamID'>>;
  }) {
    const sourceProject = await this.project.findOneOrFail(sourceAssistantID);

    if (!sourceProject.devVersion) {
      throw new InternalServerErrorException(`The dev environment id doesn't exist.`);
    }

    const targetProject = targetAssistantID ? await this.version.findOne(targetAssistantID) : null;

    if (targetProject) {
      throw new BadRequestException(`The assistant with ID '${targetAssistantID}' already exists.`);
    }

    const assistantID = targetAssistantID ?? new ObjectId().toJSON();
    const environmentID = targetVersionOverride._id ?? new ObjectId().toJSON();

    const sourceProjectJSON = this.project.toJSON(sourceProject);

    const project = await this.project.createOne(
      this.project.fromJSON({
        ...Utils.object.omit(sourceProjectJSON, ['privacy', 'apiPrivacy', 'prototype', 'liveVersion', 'previewVersion']),
        _version: LATEST_PROJECT_VERSION,
        ...targetProjectOverride,
        _id: assistantID,
        teamID: targetWorkspaceID,
        members: [],
        updatedAt: new Date().toJSON(),
        devVersion: environmentID,
        ...((sourceProjectJSON.knowledgeBase || targetProjectOverride?.knowledgeBase) && {
          knowledgeBase: { ...sourceProjectJSON.knowledgeBase, documents: {}, faqSets: {}, tags: {}, ...targetProjectOverride?.knowledgeBase },
        }),
      })
    );

    let assistant: AssistantObject;

    try {
      assistant = await this.createOne({
        id: assistantID,
        name: project.name,
        updatedByID: userID,
        workspaceID: targetWorkspaceID,
        activePersonaID: null,
        activeEnvironmentID: environmentID,
      });
    } catch {
      await this.project.deleteOne(project._id.toJSON());

      throw new InternalServerErrorException(`Couldn't clone the assistant.`);
    }

    let version: VersionObject;

    try {
      ({ version } = await this.environment.cloneOne({
        cloneDiagrams: true,
        sourceEnvironmentID: sourceProject.devVersion.toJSON(),
        targetEnvironmentID: environmentID,
        targetVersionOverride: {
          ...Utils.object.omit(targetVersionOverride, ['_id']),
          name: targetVersionOverride.name ?? 'Initial Version',
          projectID: assistantID,
          creatorID: userID,
        },
      }));
    } catch {
      await this.deleteOne(assistant.id);
      await this.project.deleteOne(project._id.toJSON());

      throw new InternalServerErrorException(`Couldn't clone the assistant.`);
    }

    try {
      await this.variableState.cloneManyByProject({ sourceProjectID: sourceAssistantID, targetProjectID: assistantID });
    } catch {
      await this.environment.deleteOne(version._id.toJSON());
      await this.deleteOne(assistant.id);
      await this.project.deleteOne(project._id.toJSON());
    }

    const { projectList, projectListCreated } = await this.addOneToProjectListIfRequired({
      workspaceID: targetWorkspaceID,
      assistantID,
      projectListID: targetProjectListID,
    });

    return { version, project, assistant, projectList, projectListCreated };
  }

  public async cloneOneAndBroadcast({
    userID,
    clientID,
    ...payload
  }: {
    userID: number;
    clientID?: string;
    sourceAssistantID: string;
    targetWorkspaceID: number;
    targetAssistantID?: string;
    targetProjectListID?: string;
    targetVersionOverride?: Partial<Omit<VersionJSON, 'id'>>;
    targetProjectOverride?: Partial<Omit<ProjectJSON, '_id' | 'teamID'>>;
  }) {
    const { project, assistant, projectList, projectListCreated } = await this.postgresEM.transactional(async () =>
      this.cloneOne({ ...payload, userID })
    );

    if (!clientID) {
      return { project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { project, assistant };
  }

  /* Create  */

  private async findOneTemplateVFFile(templatePlatform: string, templateTag = 'default') {
    try {
      // template name patter is `{platform}_{tag}.template.json`
      const vfFile = await fs.readFile(new URL(`templates/${templatePlatform}_${templateTag}.template.json`, import.meta.url), 'utf8');

      return AssistantImportDataDTO.parse(JSON.parse(vfFile));
    } catch {
      throw new BadRequestException(`Couldn't find a template with tag '${templateTag}' for platform '${templatePlatform}'.`);
    }
  }

  public async createOneFromTemplate(
    userID: number,
    {
      nlu,
      modality,
      templateTag: templateTagProp,
      workspaceID,
      projectListID,
      projectLocales,
      projectMembers,
      projectOverride,
    }: CreateFromTemplateData
  ) {
    const platformConfig = Platform.Config.get(modality.platform);
    const projectConfig = Platform.Config.getTypeConfig(modality);
    const defaultTemplateTag = Object.keys(platformConfig.types).length > 1 ? modality.type : 'default';
    const localeDefaultVoice = projectConfig.utils.voice.getLocaleDefault(projectLocales);
    const storeLocalesInPublishing = projectConfig.project.locale.storedIn === 'publishing';

    let templateTag = templateTagProp ?? defaultTemplateTag;

    const nonEnglishLocale = projectLocales
      .map(projectConfig.utils.locale.toVoiceflowLocale)
      .includes(Platform.Voiceflow.Common.Project.Locale.CONFIG.enum.EN_US);

    if (!nonEnglishLocale || nlu) {
      templateTag = `${defaultTemplateTag}:empty`;
    }

    const templateVFFle = await this.findOneTemplateVFFile(modality.platform, templateTag);

    const platformData = templateVFFle.version.platformData as Record<string, any>;

    // update template to store locales and default voice
    platformData.settings = {
      ...platformData.settings,
      ...(localeDefaultVoice && { defaultVoice: localeDefaultVoice }),
      ...(!storeLocalesInPublishing && { locales: projectLocales }),
    };
    platformData.publishing = { ...platformData.publishing, ...(storeLocalesInPublishing && { locales: projectLocales }) };

    const { project, version, assistant, projectList, projectListCreated } = await this.importJSON({
      data: templateVFFle,
      userID,
      workspaceID,
      projectListID,
      centerDiagrams: true,
      projectOverride,
    });

    // importing nlu data
    if (nlu) {
      const cmsData = {
        ...Realtime.Adapters.intentToLegacyIntent.mapToDB(
          { intents: nlu.intents, notes: [] },
          {
            creatorID: userID,
            legacySlots: nlu.slots,
            assistantID: project._id.toJSON(),
            environmentID: version._id.toJSON(),
          }
        ),
        ...Realtime.Adapters.entityToLegacySlot.mapToDB(nlu.slots, {
          creatorID: userID,
          assistantID: project._id.toJSON(),
          environmentID: version._id.toJSON(),
        }),
      };

      try {
        await this.environment.upsertIntentsAndEntities(cmsData, { userID, assistantID: project._id.toJSON(), environmentID: version._id.toJSON() });

        await this.version.patchOnePlatformData(version._id, {
          slots: _.uniqBy([...version.platformData.slots, ...nlu.slots], (intent) => intent.key),
          intents: _.uniqBy([...version.platformData.intents, ...nlu.intents], (slot) => slot.key),
        });
      } catch {
        await this.project.deleteOne(project._id.toJSON());
        await this.deleteOne(project._id.toJSON());

        throw new InternalServerErrorException(`Couldn't import nlu data.`);
      }
    }

    if (projectMembers?.length) {
      await this.identityClient.private
        .addManyProjectMembersToProject(project._id.toJSON(), {
          members: projectMembers.map(({ role, creatorID }) => ({ role, userID: creatorID })),
          inviterUserID: userID,
        })
        .catch(() => null);
    }

    return { project, assistant, projectList, projectListCreated };
  }

  public async createOneFromTemplateAndBroadcast({ userID, clientID }: AuthMetaPayload, data: CreateFromTemplateData) {
    const { project, assistant, projectList, projectListCreated } = await this.createOneFromTemplate(userID, data);

    if (!clientID) {
      return { project, assistant };
    }

    await this.broadcastAddOne({
      project,
      authMeta: { userID, clientID },
      assistant,
      projectList,
      projectListCreated,
    });

    return { project, assistant };
  }

  async migrateOne({ cms }: Realtime.Migrate.MigrationData, patches: Patch[]) {
    const hasAssistantPatches = patches.some(({ path }) => path[0] === 'cms' && path[1] === 'assistant');

    if (!cms.assistant || !hasAssistantPatches) return;

    await this.upsertOne(
      this.fromJSON({
        ...cms.assistant,
        workspaceID: this.assistantSerializer.decodeWorkspaceID(cms.assistant.workspaceID),
      })
    );
  }
}
