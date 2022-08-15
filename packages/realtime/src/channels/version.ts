import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  protected channel = Realtime.Channels.version;

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.access.canRead(Number(ctx.userId), ctx.params.versionID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID, versionID } = ctx.params;
    const creatorID = Number(ctx.userId);

    const dbCreator = await this.services.project.getCreator(creatorID, projectID, versionID);

    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbCreator.version.platformData.slots);
    const notes = Realtime.Adapters.noteAdapter.mapFromDB(dbCreator.version.notes ? Object.values(dbCreator.version.notes) : []);
    const project = Realtime.Adapters.projectAdapter.fromDB(dbCreator.project);
    const domains = Realtime.Adapters.domainAdapter.mapFromDB(dbCreator.version.domains ?? []);
    const canvasTemplates = Realtime.Adapters.canvasTemplateAdapter.mapFromDB(dbCreator.version.canvasTemplates ?? []);
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

    return [
      Realtime.note.load({ notes, workspaceID, projectID, versionID }),
      Realtime.slot.crud.replace({ values: slots, workspaceID, projectID, versionID }),
      Realtime.domain.crud.replace({ values: domains, workspaceID, projectID, versionID }),
      Realtime.canvasTemplate.crud.replace({ values: canvasTemplates, workspaceID, projectID, versionID }),
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
}

export default VersionChannel;
