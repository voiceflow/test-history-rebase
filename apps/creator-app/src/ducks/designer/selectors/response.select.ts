import { Utils } from '@voiceflow/common';
import type { AnyAttachment, AnyResponseAttachment } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils/selector';
import { markupToString } from '@/utils/markup.util';
import { isCardResponseAttachment, isPromptResponseVariant, isTextResponseVariant } from '@/utils/response.util';

import { getOneByID as getAttachmentByID } from '../attachment/attachment.select';
import { map as entityMap } from '../entity/selectors/crud.select';
import { getOneByID as getOnePromptByID } from '../prompt/prompt.select';
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
  getOnePromptByID,
  variableMap,
  entityMap,
  (discriminator, getVariantByID, getPrompt, variablesMap, entitiesMap) =>
    discriminator?.variantOrder
      .map((variantID) => {
        const variant = getVariantByID({ id: variantID });

        if (!variant) return null;

        if (isTextResponseVariant(variant)) {
          return markupToString.fromDB(variant.text, { entitiesMapByID: entitiesMap, variablesMapByID: variablesMap });
        }

        if (isPromptResponseVariant(variant)) {
          const prompt = getPrompt({ id: variant.promptID });

          if (!prompt) return null;

          return markupToString.fromDB(prompt.text, { entitiesMapByID: entitiesMap, variablesMapByID: variablesMap });
        }

        return markupToString.fromDB(variant.json, { entitiesMapByID: entitiesMap, variablesMapByID: variablesMap });
      })
      .filter(Utils.array.isNotNullish) ?? []
);

export const getAllStringResponseVariantsByLanguageChannelResponseID = createCurriedSelector(allStringResponseVariantsByLanguageChannelResponseID);
