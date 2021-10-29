import { SendBackActions } from '@logux/server';
import { DiagramType, VersionFolderItemType } from '@voiceflow/api-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  protected channel = Realtime.Channels.version;

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.canRead(Number(ctx.userId), ctx.params.versionID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID, versionID } = ctx.params;
    const creatorID = Number(ctx.userId);

    const [project, dbVersion, isTopicsAndComponents] = await Promise.all([
      this.services.project.get(creatorID, ctx.params.projectID).then(Realtime.Adapters.projectAdapter.fromDB),
      this.services.version.get(creatorID, ctx.params.versionID),
      this.services.workspace.isFeatureEnabled(creatorID, ctx.params.workspaceID, 'topics_and_components'),
    ]);
    const { platform } = project;
    const version = Realtime.Adapters.versionAdapter.fromDB(dbVersion as Realtime.AnyDBVersion, { platform });

    const [diagrams, intentSteps] = await Promise.all([
      this.services.diagram
        .getAll(creatorID, ctx.params.versionID)
        .then((dbDiagrams) => Realtime.Adapters.diagramAdapter.mapFromDB(dbDiagrams, { rootDiagramID: version.rootDiagramID })),
      this.services.version.getIntentSteps(creatorID, ctx.params.versionID, version.rootDiagramID),
    ]);

    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbVersion.platformData.slots);
    const intents = Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapFromDB(dbVersion.platformData.intents, { platform });
    const products =
      'products' in project.platformData
        ? Realtime.Adapters.productAdapter.mapFromDB(Object.values((project.platformData as Realtime.AlexaProjectData).products))
        : [];

    // perform initial conversion
    if (isTopicsAndComponents && !version.topics.length) {
      const topics = diagrams
        .filter((diagram) => diagram.type === DiagramType.TOPIC)
        .map((diagram) => ({ sourceID: diagram.id, type: VersionFolderItemType.DIAGRAM }));

      const components = diagrams
        .filter((diagram) => diagram.type === DiagramType.COMPONENT)
        .map((diagram) => ({ sourceID: diagram.id, type: VersionFolderItemType.DIAGRAM }));

      version.topics = topics;
      version.components = components;
      await this.services.version.patch(creatorID, versionID, { topics, components });
    }

    return [
      Realtime.slot.crud.replace({ values: slots, workspaceID, projectID, versionID }),
      Realtime.intent.crud.replace({ values: intents, workspaceID, projectID, versionID }),
      Realtime.product.crud.replace({ values: products, workspaceID, projectID, versionID }),
      Realtime.diagram.crud.replace({ values: diagrams, workspaceID, projectID, versionID }),
      Realtime.diagram.loadIntentSteps({ intentSteps, workspaceID, projectID, versionID }),
      Realtime.version.crud.add({ value: version, key: versionID, workspaceID, projectID }),
      Realtime.project.crud.add({ value: project, key: projectID, workspaceID }),
      Realtime.version.activateVersion({ workspaceID, projectID, versionID, diagramID: version.rootDiagramID }),
    ];
  };
}

export default VersionChannel;
