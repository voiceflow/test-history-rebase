import { Utils } from '@voiceflow/common';
import type { AnyAttachment, AnyResponseAttachment } from '@voiceflow/dtos';
import { markupToString } from '@voiceflow/utils-designer';
import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils/selector';
import { isCardResponseAttachment, isTextResponseVariant } from '@/utils/response.util';

import { getOneByID as getAttachmentByID } from '../attachment/attachment.select';
import { map as entityMap } from '../entity/selectors/crud.select';
import { allByIDs as allResponseAttachmentByIDs } from '../response/response-attachment/response-attachment.select';
import { oneByLanguageChannelResponseID as oneResponseDiscriminatorByLanguageChannelResponseID } from '../response/response-discriminator/response-discriminator.select';
import { getOneByID as getOneResponseVariantByID } from '../response/response-variant/response-variant.select';
import { map as variableMap } from '../variable/variable.select';

export const allResponseAttachmentWithAttachmentByIDs = createSelector(
  allResponseAttachmentByIDs,
  getAttachmentByID,
  (responseAttachments, getOneByID) =>
    responseAttachments
      .map((responseAttachment) => ({
        ...responseAttachment,
        attachment: isCardResponseAttachment(responseAttachment)
          ? getOneByID({ id: responseAttachment.cardID })
          : getOneByID({ id: responseAttachment.mediaID }),
      }))
      .filter((result): result is AnyResponseAttachment & { attachment: AnyAttachment } => !!result.attachment)
);

export const allStringResponseVariantsByLanguageChannelResponseID = createSelector(
  oneResponseDiscriminatorByLanguageChannelResponseID,
  getOneResponseVariantByID,
  variableMap,
  entityMap,
  (discriminator, getVariantByID, variablesMap, entitiesMap) =>
    discriminator?.variantOrder
      .map((variantID) => {
        const variant = getVariantByID({ id: variantID });

        if (!variant) return null;

        if (isTextResponseVariant(variant)) {
          return markupToString.fromDB(variant.text, { entitiesMapByID: entitiesMap, variablesMapByID: variablesMap });
        }

        return null;
      })
      .filter(Utils.array.isNotNullish) ?? []
);

export const getAllStringResponseVariantsByLanguageChannelResponseID = createCurriedSelector(
  allStringResponseVariantsByLanguageChannelResponseID
);
