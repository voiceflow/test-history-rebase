import { type AnyResponseVariantWithData, ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import React, { useMemo } from 'react';

import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { useResponseVariants } from '@/components/Response/ResponseEditForm/ResponseEditForm.hook';
import { ResponseEditVariant } from '@/components/Response/ResponseEditVariant/ResponseEditVariant.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { getResponseVariantWithData, responseTextVariantCreateDataFactory } from '@/utils/response.util';

import { IntentRequiredEntityAutomaticRepromptPopper } from '../IntentRequiredEntityAutomaticRepromptPopper/IntentRequiredEntityAutomaticRepromptPopper.component';
import { IntentRequiredEntityRepromptsPopper } from '../IntentRequiredEntityRepromptsPopper/IntentRequiredEntityRepromptsPopper.component';
import type { IIntentEditRequiredEntityItem } from './IntentEditRequiredEntityItem.interface';

export const IntentEditRequiredEntityItem: React.FC<IIntentEditRequiredEntityItem> = ({ requiredEntity, requiredEntityIDs }) => {
  const promptsMap = useSelector(Designer.Prompt.selectors.map);
  const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);
  const automaticReprompt = useSelector(Designer.Intent.selectors.automaticRepromptByID, {
    id: requiredEntity.intentID,
  });
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const deleteReprompt = useDispatch(Designer.Response.ResponseVariant.effect.deleteOne);
  const patchRequiredEntity = useDispatch(Designer.Intent.RequiredEntity.effect.patchOne);
  const createRepromptEmpty = useDispatch(Designer.Response.ResponseVariant.effect.createOneEmpty);
  const { variants, discriminatorID } = useResponseVariants({ responseID: requiredEntity.repromptID || '' });

  const onCreateEmpty = async () => {
    const response = await createResponse({
      name: 'Required entity response',
      folderID: null,
      variants: [responseTextVariantCreateDataFactory()],
    });

    patchRequiredEntity(requiredEntity.id, { repromptID: response.id });
  };

  const onRepromptCreate = async () => {
    if (!discriminatorID) {
      await onCreateEmpty();
      return;
    }

    createRepromptEmpty(discriminatorID, ResponseVariantType.TEXT);
  };

  const onRepromptDelete = async (repromptID: string) => {
    if (variants.length === 1) return;

    await deleteReprompt(repromptID);
  };

  const onEntityReplace = async ({ entityID }: { oldEntityID: string; entityID: string }) => patchRequiredEntity(requiredEntity.id, { entityID });

  const reprompts = useMemo(
    () => variants.map<AnyResponseVariantWithData>((variant) => getResponseVariantWithData({ variant, promptsMap })),
    [variants, promptsMap]
  );

  return automaticReprompt ? (
    <IntentRequiredEntityAutomaticRepromptPopper
      entityID={requiredEntity.entityID}
      entityIDs={requiredEntityIDs}
      entityName={entitiesMap[requiredEntity.entityID]?.name ?? ''}
      onEntityReplace={onEntityReplace}
    />
  ) : (
    <IntentRequiredEntityRepromptsPopper
      reprompts={reprompts}
      entityName={entitiesMap[requiredEntity.entityID]?.name ?? ''}
      onRepromptAdd={onRepromptCreate}
    >
      {() =>
        reprompts.map((reprompt, index) => (
          <ResponseEditVariant
            key={reprompt.id}
            variant={reprompt}
            removeButton={<CMSFormListButtonRemove disabled={reprompts.length === 1} onClick={() => onRepromptDelete(reprompt.id)} />}
            autoFocusIfEmpty
            textVariantProps={{ placeholder: `Enter reprompt ${index + 1}` }}
          />
        ))
      }
    </IntentRequiredEntityRepromptsPopper>
  );
};
