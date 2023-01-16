import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Account from '@/ducks/account';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

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
        sourceID: dataSourceID,
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
