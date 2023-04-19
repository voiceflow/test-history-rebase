import { SendBackActions } from '@logux/server';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext, ChannelSubscribeAction } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

const initializeTemplateDiagramAction = (
  templateDiagram: BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>,
  options: { platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType },
  actionContext: { projectID: string; versionID: string; workspaceID: string }
) => {
  const { nodes, data, ports, links } = Realtime.Adapters.creatorAdapter.fromDB(templateDiagram, {
    ...options,
    context: {},
  });

  return Realtime.canvasTemplate.initialize({
    ...actionContext,
    diagramID: templateDiagram._id,
    nodesWithData: nodes.map((node) => ({ node, data: data[node.id] })),
    ports,
    links,
  });
};

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  protected channel = Realtime.Channels.version;

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.access.canRead(Number(ctx.userId), ctx.params.versionID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>, action: ChannelSubscribeAction): Promise<SendBackActions> => {
    // do not reload if resubscribing
    if (action.since) return [];

    const { workspaceID, projectID, versionID } = ctx.params;
    const creatorID = Number(ctx.userId);

    const [threads, customBlocks, projectMembers, dbCreator] = await Promise.all([
      this.services.thread.getAll(creatorID, projectID),
      this.services.customBlock.getAll(creatorID, projectID),
      this.services.project.member.getAll(creatorID, projectID),
      this.services.project.getCreator(creatorID, projectID, versionID),
    ]);

    const templateDiagram = dbCreator.version.templateDiagramID
      ? await this.services.diagram.get(dbCreator.version.templateDiagramID).catch(() => null)
      : null;

    const project = Realtime.Adapters.projectAdapter.fromDB(dbCreator.project, { members: projectMembers });
    const projectConfig = Platform.Config.getTypeConfig(project);

    const intents = projectConfig.adapters.intent.smart.mapFromDB(dbCreator.version.platformData.intents);
    const version = projectConfig.adapters.version.simple.fromDB(
      { ...dbCreator.version, templateDiagramID: templateDiagram?._id },
      { globalVariables: projectConfig.project.globalVariables, defaultVoice: projectConfig.project.voice.default }
    );

    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbCreator.version.platformData.slots);
    const notes = Realtime.Adapters.noteAdapter.mapFromDB(dbCreator.version.notes ? Object.values(dbCreator.version.notes) : []);
    const domains = Realtime.Adapters.domainAdapter.mapFromDB(dbCreator.version.domains ?? []);
    const diagrams = Realtime.Adapters.diagramAdapter.mapFromDB(dbCreator.diagrams, { rootDiagramID: dbCreator.version.rootDiagramID });
    const variableStates = Realtime.Adapters.variableStateAdapter.mapFromDB(dbCreator.variableStates);
    const canvasTemplates = Realtime.Adapters.canvasTemplateAdapter.mapFromDB(dbCreator.version.canvasTemplates ?? []);
    const nluUnclassifiedData = Realtime.Adapters.nlu.nluUnclassifiedDataAdapter.mapFromDB(dbCreator.version.nluUnclassifiedData ?? []);

    const products =
      'products' in project.platformData
        ? Realtime.Adapters.productAdapter.mapFromDB(Object.values((project.platformData as Realtime.AlexaProjectData).products))
        : [];

    const sharedNodes = this.services.diagram.getSharedNodes(dbCreator.diagrams);

    const prototypeSettings = {
      ...dbCreator.version.prototype?.settings,
      layout: (dbCreator.version.prototype?.settings.layout ??
        Realtime.Utils.platform.getDefaultPrototypeLayout(project.type)) as Realtime.PrototypeLayout,
    };

    const actionContext = { projectID, versionID, workspaceID };

    return [
      Realtime.note.load({ ...actionContext, notes }),
      Realtime.slot.crud.replace({ ...actionContext, values: slots }),
      Realtime.thread.crud.replace({ ...actionContext, values: threads }),
      Realtime.customBlock.crud.replace({ ...actionContext, values: customBlocks }),
      Realtime.domain.crud.replace({ ...actionContext, values: domains }),
      Realtime.canvasTemplate.crud.replace({ ...actionContext, values: canvasTemplates }),
      Realtime.intent.crud.replace({
        ...actionContext,
        values: intents,
        projectMeta: { platform: project.platform, type: project.type, nlu: project.nlu },
      }),
      Realtime.product.crud.replace({ ...actionContext, values: products }),
      Realtime.diagram.crud.replace({ ...actionContext, values: diagrams }),
      Realtime.variableState.crud.replace({ ...actionContext, values: variableStates }),
      Realtime.nlu.crud.replace({ ...actionContext, values: nluUnclassifiedData }),
      Realtime.diagram.sharedNodes.load({ ...actionContext, sharedNodes }),
      Realtime.project.crud.add({ ...actionContext, key: project.id, value: project }),
      Realtime.version.crud.add({ ...actionContext, value: version, key: versionID }),
      Realtime.version.replacePrototypeSettings({ ...actionContext, settings: prototypeSettings }),
      Realtime.version.activateVersion({ ...actionContext, type: project.type, platform: project.platform }),
      ...(templateDiagram
        ? [initializeTemplateDiagramAction(templateDiagram, { platform: project.platform, projectType: project.type }, actionContext)]
        : []),
    ];
  };
}

export default VersionChannel;
