import { Actions } from '@voiceflow/sdk-logux-designer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';

import { SetNLUTrainingDiffStatus } from './environment.action';
import type { EnvironmentState } from './environment.state';
import { INITIAL_STATE } from './environment.state';

export const environmentReducer = reducerWithInitialState<EnvironmentState>(INITIAL_STATE)
  .case(Actions.Environment.UpdateNLUTrainingDiff, (state, { data, status }) => ({ ...state, nluTrainingDiff: { data, status } }))
  .case(SetNLUTrainingDiffStatus, (state, { status }) => ({ ...state, nluTrainingDiff: { ...state.nluTrainingDiff, status } }))

  // revalidate the status when any of the following actions are dispatched
  .cases<any>(
    [
      Actions.Intent.AddOne,
      Actions.Intent.AddMany,
      Actions.Intent.DeleteOne,
      Actions.Intent.DeleteMany,
      Actions.Intent.PatchOne,
      Actions.Intent.PatchMany,

      Actions.Utterance.AddOne,
      Actions.Utterance.AddMany,
      Actions.Utterance.DeleteOne,
      Actions.Utterance.DeleteMany,
      Actions.Utterance.PatchOne,
      Actions.Utterance.PatchMany,

      Actions.RequiredEntity.AddOne,
      Actions.RequiredEntity.AddMany,
      Actions.RequiredEntity.DeleteOne,
      Actions.RequiredEntity.DeleteMany,
      Actions.RequiredEntity.PatchOne,
      Actions.RequiredEntity.PatchMany,

      Actions.Entity.AddOne,
      Actions.Entity.AddMany,
      Actions.Entity.DeleteOne,
      Actions.Entity.DeleteMany,
      Actions.Entity.PatchOne,
      Actions.Entity.PatchMany,

      Actions.EntityVariant.AddOne,
      Actions.EntityVariant.AddMany,
      Actions.EntityVariant.DeleteOne,
      Actions.EntityVariant.DeleteMany,
      Actions.EntityVariant.PatchOne,
      Actions.EntityVariant.PatchMany,
    ],
    (state) => ({ ...state, nluTrainingDiff: { ...state.nluTrainingDiff, status: NLUTrainingDiffStatus.UNKNOWN } })
  );
