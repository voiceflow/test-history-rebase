/* eslint-disable no-param-reassign */
import { SendBackActions } from '@logux/server';
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import logger from '@/logger';

import { AbstractChannelControl } from './utils';

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  protected channel = Realtime.Channels.version;

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.canRead(Number(ctx.userId), ctx.params.versionID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID, versionID } = ctx.params;
    const creatorID = Number(ctx.userId);

    const [project, dbVersion, isTopicsAndComponents, variableStates] = await Promise.all([
      this.services.project.get(creatorID, projectID).then(Realtime.Adapters.projectAdapter.fromDB),
      this.services.version.get(creatorID, versionID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, 'topics_and_components'),
      this.services.variableState.getAll(creatorID, projectID).then(Realtime.Adapters.variableStateAdapter.mapFromDB),
    ]);
    const { platform, platformV2, typeV2: projectType } = project;
    const version = Realtime.Adapters.versionAdapter.fromDB(dbVersion as Realtime.AnyDBVersion, { platform: platformV2, projectType });

    const [diagrams, { startingBlocks, intentSteps }] = await Promise.all([
      this.services.diagram
        .getAll(creatorID, versionID)
        .then((dbDiagrams) => Realtime.Adapters.diagramAdapter.mapFromDB(dbDiagrams, { rootDiagramID: version.rootDiagramID })),
      this.services.version.getResourcesFromDiagrams(creatorID, versionID),
    ]);

    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbVersion.platformData.slots);
    const notes = Realtime.Adapters.noteAdapter.mapFromDB(dbVersion.notes ? Object.values(dbVersion.notes) : []);
    const intents = Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectType).mapFromDB(dbVersion.platformData.intents, { platform });
    const products =
      'products' in project.platformData
        ? Realtime.Adapters.productAdapter.mapFromDB(Object.values((project.platformData as Realtime.AlexaProjectData).products))
        : [];

    if (isTopicsAndComponents) {
      await this.migrateTopicsAndComponents({ project, version, diagrams, creatorID, intentSteps });
    }

    return [
      Realtime.note.load({ notes, workspaceID, projectID, versionID }),
      Realtime.slot.crud.replace({ values: slots, workspaceID, projectID, versionID }),
      Realtime.intent.crud.replace({ values: intents, workspaceID, projectID, versionID, projectMeta: { platform: platformV2, type: projectType } }),
      Realtime.product.crud.replace({ values: products, workspaceID, projectID, versionID }),
      Realtime.diagram.crud.replace({ values: diagrams, workspaceID, projectID, versionID }),
      Realtime.variableState.crud.replace({ values: variableStates, workspaceID, projectID, versionID }),
      Realtime.diagram.loadIntentSteps({ intentSteps, workspaceID, projectID, versionID }),
      Realtime.diagram.loadStartingBlocks({ startingBlocks, workspaceID, projectID, versionID }),
      Realtime.version.crud.add({ value: version, key: versionID, workspaceID, projectID }),
      Realtime.project.crud.add({ value: project, key: projectID, workspaceID }),
      Realtime.version.activateVersion({ workspaceID, projectID, versionID, projectType }),
    ];
  };

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
    // TODO: replace try/catch with the version.canWrite and diagram.canWrite checks
    // diagram.version patches can crash for non-editor users
    try {
      // perform initial conversion
      // eslint-disable-next-line no-underscore-dangle
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
  };
}

export default VersionChannel;
