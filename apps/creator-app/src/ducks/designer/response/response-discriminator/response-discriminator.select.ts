import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils';

import { channelParamSelector, createDesignerCRUDSelectors, languageParamSelector, responseIDParamSelector } from '../../utils';
import { root as responseRoot } from '../selectors/root.select';
import { STATE_KEY } from './response-discriminator.state';

const root = createSubSelector(responseRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allByResponseID = createSelector(all, responseIDParamSelector, (discriminators, responseID) =>
  discriminators.filter((discriminator) => discriminator.responseID === responseID)
);

export const idByLanguageChannelResponseIDMap = createSelector(root, (state) => state.idByLanguageChannelResponseID);

export const idByChannelResponseIDMapByLanguage = createSelector(idByLanguageChannelResponseIDMap, languageParamSelector, (state, language) =>
  language ? state[language] ?? null : null
);

export const idByResponseIDMapByLanguageChannel = createSelector(idByChannelResponseIDMapByLanguage, channelParamSelector, (state, channel) =>
  channel ? state?.[channel] ?? null : null
);

export const idByMapByLanguageChannelResponseID = createSelector(idByResponseIDMapByLanguageChannel, responseIDParamSelector, (state, responseID) =>
  responseID ? state?.[responseID] ?? null : null
);

export const oneByLanguageChannelResponseID = createSelector(idByMapByLanguageChannelResponseID, map, (id, map) => (id ? map[id] : null));

export const getOneByLanguageChannelResponseID = createSelector(
  map,
  idByLanguageChannelResponseIDMap,
  (map, idMap) =>
    ({
      channel,
      language,
      responseID,
    }: Parameters<typeof responseIDParamSelector>[1] & Parameters<typeof languageParamSelector>[1] & Parameters<typeof channelParamSelector>[1]) => {
      if (!responseID || !language || !channel) return null;

      const id = idMap[language]?.[channel]?.[responseID];

      return id ? map[id] : null;
    }
);
