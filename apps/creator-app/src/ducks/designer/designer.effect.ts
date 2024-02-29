import { AnyAttachment, AnyResponseVariant, CardButton } from '@voiceflow/dtos';
import { AssistantPublicHTTPControllerExportCMS201 } from '@voiceflow/sdk-http-designer/generated';
import { Actions } from '@voiceflow/sdk-logux-designer';

import type { Thunk } from '@/store/types';

export const replaceAssistant =
  (cms: AssistantPublicHTTPControllerExportCMS201): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    if (!state.session.activeProjectID || !state.session.activeVersionID) return;

    const context = {
      assistantID: state.session.activeProjectID,
      environmentID: state.session.activeVersionID,
    };

    // attachments
    dispatch(Actions.Attachment.Replace({ data: (cms.attachments ?? []) as AnyAttachment[], context }));
    dispatch(Actions.CardButton.Replace({ data: (cms.cardButtons ?? []) as CardButton[], context }));

    // folder
    dispatch(Actions.Folder.Replace({ data: cms.folders ?? [], context }));

    // entity
    dispatch(Actions.Entity.Replace({ data: cms.entities ?? [], context }));
    dispatch(Actions.EntityVariant.Replace({ data: cms.entityVariants ?? [], context }));

    // variable
    dispatch(Actions.Variable.Replace({ data: cms.variables ?? [], context }));

    // flows
    dispatch(Actions.Flow.Replace({ data: cms.flows ?? [], context }));

    // intent
    dispatch(Actions.Intent.Replace({ data: cms.intents ?? [], context }));
    dispatch(Actions.Utterance.Replace({ data: cms.utterances ?? [], context }));
    dispatch(Actions.RequiredEntity.Replace({ data: cms.requiredEntities ?? [], context }));

    // response
    dispatch(Actions.Response.Replace({ data: cms.responses ?? [], context }));
    dispatch(Actions.ResponseDiscriminator.Replace({ data: cms.responseDiscriminators ?? [], context }));
    dispatch(Actions.ResponseVariant.Replace({ data: (cms.responseVariants ?? []) as AnyResponseVariant[], context }));
    dispatch(Actions.ResponseAttachment.Replace({ data: cms.responseAttachments ?? [], context }));

    // function
    dispatch(Actions.Function.Replace({ data: cms.functions ?? [], context }));
    dispatch(Actions.FunctionPath.Replace({ data: cms.functionPaths ?? [], context }));
    dispatch(Actions.FunctionVariable.Replace({ data: cms.functionVariables ?? [], context }));

    // assistant - should be last
    dispatch(Actions.Assistant.AddOne({ data: cms.assistant, context: { workspaceID: cms.assistant.workspaceID } }));
  };
