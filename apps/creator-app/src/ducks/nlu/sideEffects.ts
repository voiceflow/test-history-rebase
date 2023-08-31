import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Account from '@/ducks/account';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Thunk } from '@/store/types';
import { validateUtterance } from '@/utils/intent';

export const importUnclassifiedData =
  (datasourceName: string, utterances: string[]): Thunk<Realtime.NLUUnclassifiedData | null> =>
  async (dispatch, getState) => {
    const dataSourceID = Utils.id.cuid.slug();
    const creatorID = Account.userIDSelector(getState());
    const importedAt = new Date();

    if (!creatorID) return null;

    const data: Realtime.NLUUnclassifiedData = {
      id: dataSourceID,
      creatorID,
      type: BaseModels.Version.NLUUnclassifiedDataType.NLU_DATASOURCE_IMPORT,
      name: datasourceName,
      importedAt: importedAt.toJSON(),
      utterances: utterances.map((u) => ({
        id: Utils.id.cuid.slug(),
        utterance: u,
        sourceID: creatorID.toString(),
        importedAt,
        datasourceID: dataSourceID,
        datasourceName,
      })),
    };

    await dispatch.sync(
      Realtime.nlu.crud.add({
        ...getActiveVersionContext(getState()),
        key: dataSourceID,
        value: data,
      })
    );

    return data;
  };

export const deleteUnclassified =
  (dataSourceID: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.nlu.crud.remove({
        ...getActiveVersionContext(getState()),
        key: dataSourceID,
      })
    );
  };

export const deleteUtterances =
  (utterances: Realtime.NLUUnclassifiedUtterances[]): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.nlu.removeManyUtterances({
        ...getActiveVersionContext(getState()),
        utterances,
      })
    );
  };

export const updateUtterances =
  (utterances: Realtime.NLUUnclassifiedUtterances[]): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(
      Realtime.nlu.updateManyUtterances({
        ...getActiveVersionContext(getState()),
        utterances,
      })
    );
  };

export const assignUtterancesToIntent =
  (intentID: string, utterances: Realtime.NLUUnclassifiedUtterances[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const intent = IntentV2.getIntentByIDSelector(state)({ id: intentID });
    const intents = IntentV2.allIntentsSelector(state);
    const platform = ProjectV2.active.platformSelector(state);

    if (!intent) return;

    const validatedUtterances = utterances
      .filter((u) => !validateUtterance(u.utterance, intentID, intents, platform))
      .map((u) => ({ text: u.utterance }));

    dispatch(IntentV2.patchIntent(intentID, { inputs: [...intent.inputs, ...validatedUtterances] }));

    await dispatch.sync(
      Realtime.nlu.removeManyUtterances({
        ...getActiveVersionContext(state),
        utterances,
      })
    );
  };
