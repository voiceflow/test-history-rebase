import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Account from '@/ducks/account';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

import { allUnclassifiedDataSelector } from './selectors';

export const importUnclassifiedData =
  (datasourceName: string, utterances: string[]): Thunk<Realtime.NluUnclassifiedData | null> =>
  async (dispatch, getState) => {
    const id = Utils.id.cuid.slug();
    const creatorID = Account.userIDSelector(getState());
    const allUnclassifiedData = allUnclassifiedDataSelector(getState());

    const importedAt = new Date();

    if (!creatorID) return null;

    const data: Realtime.NluUnclassifiedData = {
      id: allUnclassifiedData.length + 1,
      creatorID,
      type: BaseModels.Version.NLUUnclassifiedDataType.NLU_DATASOURCE_IMPORT,
      name: datasourceName,
      utterances: utterances.map((u) => ({ utterance: u, importedAt, sourceID: creatorID.toString() })),
    };

    await dispatch.sync(
      Realtime.nlu.crud.add({
        ...getActiveVersionContext(getState()),
        key: id,
        value: data,
      })
    );

    return data;
  };
