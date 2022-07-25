import { SendBackActions } from '@logux/server';
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import logger from '@/logger';

import { AbstractChannelControl } from './utils';

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  protected channel = Realtime.Channels.version;

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.access.canRead(Number(ctx.userId), ctx.params.versionID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID, versionID } = ctx.params;
    const creatorID = Number(ctx.userId);

    const [dbCreator, isTopicsAndComponents, assistantIA] = await Promise.all([
      this.services.project.getCreator(creatorID, projectID, versionID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.TOPICS_AND_COMPONENTS),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.ASSISTANT_IA),
    ]);

    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbCreator.version.platformData.slots);
    const notes = Realtime.Adapters.noteAdapter.mapFromDB(dbCreator.version.notes ? Object.values(dbCreator.version.notes) : []);
    const project = Realtime.Adapters.projectAdapter.fromDB(dbCreator.project);
    const domains = Realtime.Adapters.domainAdapter.mapFromDB(dbCreator.version.domains ?? []);
    const diagrams = Realtime.Adapters.diagramAdapter.mapFromDB(dbCreator.diagrams, { rootDiagramID: dbCreator.version.rootDiagramID });
    const variableStates = Realtime.Adapters.variableStateAdapter.mapFromDB(dbCreator.variableStates);

    const { platform, type: projectType } = project;

    const version = Realtime.Adapters.versionAdapter.fromDB(dbCreator.version as Realtime.AnyDBVersion, { platform, projectType });
    const intents = Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectType).mapFromDB(dbCreator.version.platformData.intents, { platform });
    const products =
      'products' in project.platformData
        ? Realtime.Adapters.productAdapter.mapFromDB(Object.values((project.platformData as Realtime.AlexaProjectData).products))
        : [];

    const { intentSteps, startingBlocks } = this.services.diagram.getResources(dbCreator.diagrams);

    if (isTopicsAndComponents && !assistantIA) {
      await this.migrateTopicsAndComponents({ project, version, diagrams, creatorID, intentSteps });
    }

    return [
      Realtime.note.load({ notes, workspaceID, projectID, versionID }),
      Realtime.slot.crud.replace({ values: slots, workspaceID, projectID, versionID }),
      Realtime.domain.crud.replace({ values: domains, workspaceID, projectID, versionID }),
      Realtime.intent.crud.replace({ values: intents, workspaceID, projectID, versionID, projectMeta: { platform, type: projectType } }),
      Realtime.product.crud.replace({ values: products, workspaceID, projectID, versionID }),
      Realtime.diagram.crud.replace({ values: diagrams, workspaceID, projectID, versionID }),
      Realtime.variableState.crud.replace({ values: variableStates, workspaceID, projectID, versionID }),
      Realtime.diagram.loadIntentSteps({ intentSteps, workspaceID, projectID, versionID }),
      Realtime.diagram.loadStartingBlocks({ startingBlocks, workspaceID, projectID, versionID }),
      Realtime.version.replacePrototypeSettings({
        workspaceID,
        projectID,
        versionID,
        settings: {
          ...dbCreator.version.prototype?.settings,
          layout: (dbCreator.version.prototype?.settings.layout ??
            Realtime.Utils.platform.getDefaultPrototypeLayout(projectType)) as Realtime.PrototypeLayout,
        },
      }),
      Realtime.version.crud.add({ value: version, key: versionID, workspaceID, projectID }),
      Realtime.project.crud.add({ value: project, key: projectID, workspaceID }),
      Realtime.version.activateVersion({ workspaceID, projectID, versionID, projectType }),
    ];
  };

  // TODO: remove this when topics and components are fully migrated, before releasing the domains
  private migrateTopicsAndComponents = async ({
    project,
    version,
    diagrams,
    creatorID,
    intentSteps,
  }: {
    project: Realtime.AnyProject;
    version: Realtime.AnyVersion;
    diagrams: Realtime.Diagram[];
    creatorID: number;
    intentSteps: Record<string, Realtime.diagram.DiagramIntentStepMap>;
  }) => {
    /* eslint-disable no-param-reassign */

    // TODO: replace try/catch with the version.canWrite and diagram.canWrite checks
    // diagram.version patches can crash for non-editor users
    try {
      // perform initial conversion
      if (project._version && project._version >= Realtime.TOPICS_AND_COMPONENTS_PROJECT_VERSION) {
        const topicsDiagrams = diagrams.filter((diagram) => diagram.type === BaseModels.Diagram.DiagramType.TOPIC);
        const componentsDiagrams = diagrams.filter((diagram) => !diagram.type || diagram.type === BaseModels.Diagram.DiagramType.COMPONENT);

        if ((version.topics?.length ?? 0) !== topicsDiagrams.length || (version.components?.length ?? 0) !== componentsDiagrams.length) {
          const topics = topicsDiagrams.map((diagram) => ({ sourceID: diagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }));
          const components = componentsDiagrams.map((diagram) => ({ sourceID: diagram.id, type: BaseModels.Version.FolderItemType.DIAGRAM }));

          version.topics = topics;
          version.components = components;

          await this.services.version.patch(creatorID, version.id, { topics, components });
        }

        await Promise.all(
          topicsDiagrams.map(async (diagram) => {
            const intentStepIDs = Object.keys(intentSteps[diagram.id] ?? {});

            if ((diagram.intentStepIDs?.length ?? 0) === intentStepIDs.length) return;

            diagram.intentStepIDs = intentStepIDs;

            await this.services.diagram.patch(creatorID, diagram.id, { intentStepIDs });
          })
        );
      }
    } catch (error) {
      logger.debug(error);
    }

    /* eslint-enable no-param-reassign */
  };
}

export default VersionChannel;
