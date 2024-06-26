import type { ResponseType } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { createByFolderIDSelectors } from '../../utils/selector.util';
import { all as allDiscriminators } from '../response-discriminator/response-discriminator.select';
import { map as mapMessages } from '../response-message/response-message.select';
import { map as mapVariants } from '../response-variant/response-variant.select';
import { all as allResponses, oneByID } from './crud.select';
export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(allResponses);

export const oneWithRelationsByID = createSelector(
  oneByID,
  (response) =>
    response && {
      ...response,
      discriminators: [],
    }
);

export const allByFolderIDAndType = (type: ResponseType) =>
  createSelector(allByFolderID, (responses) => responses.filter((response) => response.type === type));

export const allByFolderIDsAndType = (type: ResponseType) =>
  createSelector(allByFolderIDs, (responses) => responses.filter((response) => response.type === type));

export const countByType = (type: ResponseType) =>
  createSelector(allResponses, (responses) =>
    responses.reduce((acc, response) => {
      if (response.type === type) acc += 1;
      return acc;
    }, 0)
  );

export const mapFirstVariantByResponseID = createSelector(
  [allResponses, allDiscriminators, mapVariants],
  (allResponses, allDiscriminators, mapVariants) =>
    Object.fromEntries(
      allResponses.map((response) => {
        const discriminator = allDiscriminators.find((discriminator) => discriminator.responseID === response.id);
        const firstVariantID = discriminator?.variantOrder[0];

        if (!firstVariantID) {
          return [response.id, null];
        }

        return [response.id, mapVariants[firstVariantID]];
      })
    )
);

export const mapFirstMessageByResponseID = createSelector(
  [allResponses, allDiscriminators, mapMessages],
  (allResponses, allDiscriminators, mapMessages) =>
    Object.fromEntries(
      allResponses.map((response) => {
        const discriminator = allDiscriminators.find((discriminator) => discriminator.responseID === response.id);
        const firstVariantID = discriminator?.variantOrder[0];

        if (!firstVariantID) {
          return [response.id, null];
        }

        return [response.id, mapMessages[firstVariantID]];
      })
    )
);
