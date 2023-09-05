import type { RequiredEntity } from '@voiceflow/sdk-logux-designer';
import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormSortableItem } from '@/components/CMS/CMSForm/CMSFormSortableItem/CMSFormSortableItem.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { IntentEditAutomaticRepromptSection } from '../IntentEditAutomaticRepromptSection/IntentEditAutomaticRepromptSection.component';
import { IntentEditRequiredEntityItem } from '../IntentEditRequiredEntityItem/IntentEditRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '../IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import type { IIntentEditRequiredEntitiesSection } from './IntentEditRequiredEntitiesSection.interface';

export const IntentEditRequiredEntitiesSection: React.FC<IIntentEditRequiredEntitiesSection> = ({ intentID }) => {
  const entityIDs = useSelector(Designer.Intent.selectors.entityOrderByID, { id: intentID }) ?? [];
  const requiredEntities = useSelector(Designer.Intent.RequiredEntity.selectors.allByIDs, { ids: entityIDs });

  const patchIntent = useDispatch(Designer.Intent.effect.patchOne);
  const createOne = useDispatch(Designer.Intent.RequiredEntity.effect.createOne);
  const deleteOne = useDispatch(Designer.Intent.RequiredEntity.effect.deleteOne);

  const onReorder = (items: RequiredEntity[]) => {
    patchIntent(intentID, { entityOrder: items.map(({ id }) => id) });
  };

  const onAddRequiredEntity = async (entityID: string) => {
    await createOne({ intentID, entityID, repromptID: null });
  };

  return (
    <>
      <IntentRequiredEntitiesSection onAdd={onAddRequiredEntity} entityIDs={entityIDs}>
        <CMSFormSortableList
          items={requiredEntities}
          getItemKey={(item) => item.id}
          onItemsReorder={onReorder}
          renderItem={({ item, ref, dragContainerProps, styles }) => (
            <CMSFormSortableItem key={item.id} ref={ref} dragButtonProps={dragContainerProps} style={styles} onRemove={() => deleteOne(item.id)}>
              <IntentEditRequiredEntityItem requiredEntity={item} requiredEntityIDs={entityIDs} />
            </CMSFormSortableItem>
          )}
        />
      </IntentRequiredEntitiesSection>

      {requiredEntities.length > 0 && (
        <>
          <Divider />
          <IntentEditAutomaticRepromptSection intentID={intentID} />
        </>
      )}
    </>
  );
};
