import { Actions } from '@voiceflow/sdk-logux-designer';

import { designerClient } from '@/client/designer';
import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';

import { SetNLUTrainingDiffStatus } from './environment.action';

export const calculateNLUTrainingDiff = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  const context = getActiveAssistantContext(state);

  try {
    dispatch(SetNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.FETCHING }));

    const { data, status } = await designerClient.environment.getNluTrainingDiff(context.environmentID);

    await dispatch.sync(Actions.Environment.UpdateNLUTrainingDiff({ data, status, context }));
  } catch {
    dispatch(SetNLUTrainingDiffStatus({ status: NLUTrainingDiffStatus.UNKNOWN }));
  }
};
