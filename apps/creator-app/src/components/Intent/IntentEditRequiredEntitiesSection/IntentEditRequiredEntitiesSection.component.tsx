import type { RequiredEntity } from '@voiceflow/dtos';
// import { Divider } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { responseTextVariantCreateDataFactory } from '@/utils/response.util';

// import { IntentEditAutomaticRepromptSection } from '../IntentEditAutomaticRepromptSection/IntentEditAutomaticRepromptSection.component';
import { IntentEditRequiredEntityItem } from '../IntentEditRequiredEntityItem/IntentEditRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '../IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import type { IIntentEditRequiredEntitiesSection } from './IntentEditRequiredEntitiesSection.interface';

export const IntentEditRequiredEntitiesSection: React.FC<IIntentEditRequiredEntitiesSection> = ({ intent }) => {
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const requiredEntities = useSelector(Designer.Intent.RequiredEntity.selectors.allByIDs, { ids: intent.entityOrder });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intent.id);
  const createOne = useDispatch(Designer.Intent.RequiredEntity.effect.createOne);
  const deleteOne = useDispatch(Designer.Intent.RequiredEntity.effect.deleteOne);

  const onReorder = (items: RequiredEntity[]) => {
    patchIntent({ entityOrder: items.map(({ id }) => id) });
  };

  const onAddRequiredEntity = async (entityID: string) => {
    const response = await createResponse({
      name: 'Required entity response',
      folderID: null,
      variants: [responseTextVariantCreateDataFactory()],
    });

    await createOne({ intentID: intent.id, entityID, repromptID: response.id });
  };

  const entityIDs = useMemo(() => requiredEntities.map(({ entityID }) => entityID), [requiredEntities]);

  return (
    <>
      <IntentRequiredEntitiesSection onAdd={onAddRequiredEntity} entityIDs={entityIDs}>
        <CMSFormSortableList
          items={requiredEntities}
          getItemKey={(item) => item.id}
          onItemsReorder={onReorder}
          renderItem={({ item, ref, dragContainerProps, styles }) => (
            <div {...dragContainerProps} ref={ref} style={{ transition: styles.transition }}>
              <CMSFormListItem pl={12} gap={4} align="center" onRemove={() => deleteOne(item.id)}>
                <IntentEditRequiredEntityItem intent={intent} entityIDs={entityIDs} requiredEntity={item} />
              </CMSFormListItem>
            </div>
          )}
        />
      </IntentRequiredEntitiesSection>

      {/* {requiredEntities.length > 0 && (
        <>
          <Divider noPadding />

          <IntentEditAutomaticRepromptSection intent={intent} />
        </>
      )} */}
    </>
  );
};
