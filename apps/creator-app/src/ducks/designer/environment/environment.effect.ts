import { AnyAttachment, AnyResponseVariant, CardButton } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { designerClient } from '@/client/designer';
import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { activeProjectIDSelector } from '@/ducks/session/selectors';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

import { SetNLUTrainingDiffStatus } from './environment.action';

/**
 * @deprecated remove with HTTP_LOAD_ENVIRONMENT ff
 */
export const load =
  (environmentID: string, abortController?: AbortController): Thunk =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async (dispatch, getState) => {
    const cms = await designerClient.assistant.exportCMS(environmentID);

    if (abortController?.signal.aborted) return;

    const state = getState();
    const assistantID = activeProjectIDSelector(state);

    if (!assistantID) return;

    const context = { assistantID, environmentID };

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

    // workflows
    dispatch(Actions.Workflow.Replace({ data: cms.workflows ?? [], context }));

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

export const calculateNLUTrainingDiff = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  const context = getActiveAssistantContext(state);

  try {
    dispatch(SetNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.FETCHING }));

    const { data, hash, status } = await designerClient.environment.getNluTrainingDiff(context.environmentID);

    await dispatch.sync(Actions.Environment.UpdateNLUTrainingDiff({ data, hash, status, context }));
  } catch {
    dispatch(SetNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.IDLE }));
  }
};
