import { AnyRecord, BaseModels, BaseVersion } from '@voiceflow/base-types';
import { AnyAttachment, AnyResponseVariant, CardButton, Diagram, Thread } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import type { DBVersion } from '@voiceflow/platform-config/build/common/configs/base/adapters/version';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { designerClient } from '@/client/designer';
import { initializeVersion } from '@/ducks/versionV2';
import type { Thunk } from '@/store/types';

import { getSharedNodes } from './assistant.util';

export const loadCreator =
  (environmentID: string, abortController: AbortController): Thunk<{ diagrams: Diagram[] }> =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (dispatch) => {
    const data = await designerClient.assistant.loadCreator(environmentID);

    if (abortController?.signal.aborted) return { diagrams: [] };

    const context = { assistantID: data.assistant.id, environmentID };
    const legacyContext = {
      projectID: data.assistant.id,
      versionID: environmentID,
      workspaceID: data.assistant.workspaceID,
    };

    const project = Realtime.Adapters.projectAdapter.fromDB(
      data.project as BaseModels.Project.Model<AnyRecord, AnyRecord>,
      { members: data.projectMembership.map(Realtime.Adapters.Identity.projectMember.fromDB) }
    );
    const projectConfig = Platform.Config.getTypeConfig(project);
    const templateDiagram = data.diagrams.find((diagram) => diagram.diagramID === data.version.templateDiagramID);

    const version = projectConfig.adapters.version.simple.fromDB(
      {
        ...data.version,
        platformData: data.version.platformData as any,
        templateDiagramID: templateDiagram?.diagramID,
      } as DBVersion<BaseVersion.Version>,
      { globalVariables: projectConfig.project.globalVariables, defaultVoice: projectConfig.project.voice.default }
    );

    // attachments
    dispatch(Actions.Attachment.Replace({ data: (data.attachments ?? []) as AnyAttachment[], context }));
    dispatch(Actions.CardButton.Replace({ data: (data.cardButtons ?? []) as CardButton[], context }));

    // folder
    dispatch(Actions.Folder.Replace({ data: data.folders ?? [], context }));

    // entity
    dispatch(Actions.Entity.Replace({ data: data.entities ?? [], context }));
    dispatch(Actions.EntityVariant.Replace({ data: data.entityVariants ?? [], context }));

    // variable
    dispatch(Actions.Variable.Replace({ data: data.variables ?? [], context }));

    // flows
    dispatch(Actions.Flow.Replace({ data: data.flows ?? [], context }));

    // workflows
    dispatch(Actions.Workflow.Replace({ data: data.workflows ?? [], context }));

    // intent
    dispatch(Actions.Intent.Replace({ data: data.intents ?? [], context }));
    dispatch(Actions.Utterance.Replace({ data: data.utterances ?? [], context }));
    dispatch(Actions.RequiredEntity.Replace({ data: data.requiredEntities ?? [], context }));

    // response
    dispatch(Actions.Response.Replace({ data: data.responses ?? [], context }));
    dispatch(Actions.ResponseDiscriminator.Replace({ data: data.responseDiscriminators ?? [], context }));
    dispatch(Actions.ResponseVariant.Replace({ data: (data.responseVariants ?? []) as AnyResponseVariant[], context }));
    dispatch(Actions.ResponseAttachment.Replace({ data: data.responseAttachments ?? [], context }));

    // function
    dispatch(Actions.Function.Replace({ data: data.functions ?? [], context }));
    dispatch(Actions.FunctionPath.Replace({ data: data.functionPaths ?? [], context }));
    dispatch(Actions.FunctionVariable.Replace({ data: data.functionVariables ?? [], context }));

    // threads
    dispatch(Actions.Thread.Replace({ context: legacyContext, data: data.threads as Thread[] }));
    dispatch(Actions.ThreadComment.Replace({ context: legacyContext, data: data.threadComments }));

    // custom blocks
    dispatch(
      Realtime.customBlock.crud.replace({
        ...legacyContext,
        values: data.version.customBlocks
          ? Realtime.Adapters.customBlockAdapter.mapFromDB(Object.values(data.version.customBlocks ?? {}))
          : [],
      })
    );

    // variable states
    dispatch(
      Realtime.variableState.crud.replace({
        ...legacyContext,
        values: Realtime.Adapters.variableStateAdapter.mapFromDB(data.variableStates),
      })
    );

    // canvas templates
    dispatch(
      Realtime.canvasTemplate.crud.replace({
        ...legacyContext,
        values: Realtime.Adapters.canvasTemplateAdapter.mapFromDB(data.version.canvasTemplates ?? []),
      })
    );

    // diagrams
    dispatch(
      Realtime.diagram.crud.replace({
        ...legacyContext,
        values: Realtime.Adapters.diagramAdapter.mapFromDB(data.diagrams, {
          rootDiagramID: data.version.rootDiagramID,
        }),
      })
    );

    // shared nodes
    dispatch(
      Realtime.diagram.sharedNodes.load({ ...legacyContext, sharedNodes: getSharedNodes(data.diagrams as Diagram[]) })
    );

    // version
    dispatch(Realtime.version.crud.add({ ...legacyContext, value: version, key: version.id }));

    // prototype-settings
    dispatch(
      Realtime.version.replacePrototypeSettings({
        ...legacyContext,
        settings: {
          ...data.version.prototype?.settings,
          layout: (data.version.prototype?.settings.layout ??
            Realtime.Utils.platform.getDefaultPrototypeLayout(project.type)) as Realtime.PrototypeLayout,
        },
      })
    );

    // template diagram
    if (templateDiagram) {
      const { nodes, data, ports, links } = Realtime.Adapters.creatorAdapter.fromDB(templateDiagram as Diagram, {
        context: {},
        platform: project.platform,
        projectType: project.type,
      });

      dispatch(
        Realtime.canvasTemplate.initialize({
          ...legacyContext,
          ports,
          links,
          diagramID: templateDiagram.diagramID,
          nodesWithData: nodes.map((node) => ({ node, data: data[node.id] })),
        })
      );
    }

    dispatch(Realtime.project.crud.add({ ...legacyContext, key: project.id, value: project }));

    // assistant
    dispatch(Actions.Assistant.AddOne({ data: data.assistant, context: { workspaceID: data.assistant.workspaceID } }));

    // initialize version - should be last
    dispatch(initializeVersion({ ...legacyContext, type: project.type, platform: project.platform }));

    return { diagrams: data.diagrams as Diagram[] };
  };
