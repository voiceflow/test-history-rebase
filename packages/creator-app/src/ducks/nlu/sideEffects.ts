import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Account from '@/ducks/account';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

export const importUnclassifiedData =
  (datasourceName: string, utterances: string[]): Thunk<Realtime.NluUnclassifiedData | null> =>
  async (dispatch, getState) => {
    const id = Utils.id.cuid.slug();
    const creatorID = Account.userIDSelector(getState());

    if (!creatorID) return null;

    const data: Realtime.NluUnclassifiedData = {
      id,
      creatorID,
      type: BaseModels.Version.NLUUnclassifiedDataType.NLU_DATASOURCE_IMPORT,
      name: datasourceName,
      importedAt: new Date().toJSON(),
      utterances: utterances.map((u) => ({ id: Utils.id.cuid.slug(), utterance: u, sourceID: creatorID.toString() })),
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
