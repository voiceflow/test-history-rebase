import type { RequiredEntity } from '@voiceflow/dtos';
// import { Divider } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { CMSFormSortableList } from '@/components/CMS/CMSForm/CMSFormSortableList/CMSFormSortableList.component';
import { Designer } from '@/ducks';
import { useAutoScrollListItemIntoView } from '@/hooks/scroll.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

// import { IntentEditAutomaticRepromptSection } from '../IntentEditAutomaticRepromptSection/IntentEditAutomaticRepromptSection.component';
import { IntentEditRequiredEntityItem } from '../IntentEditRequiredEntityItem/IntentEditRequiredEntityItem.component';
import { IntentRequiredEntitiesSection } from '../IntentRequiredEntitiesSection/IntentRequiredEntitiesSection.component';
import type { IIntentEditRequiredEntitiesSection } from './IntentEditRequiredEntitiesSection.interface';

export const IntentEditRequiredEntitiesSection: React.FC<IIntentEditRequiredEntitiesSection> = ({ intent }) => {
  const requiredEntities = useSelector(Designer.Intent.RequiredEntity.selectors.allByIDs, { ids: intent.entityOrder });

  const createOne = useDispatch(Designer.Intent.RequiredEntity.effect.createOne);
  const deleteOne = useDispatch(Designer.Intent.RequiredEntity.effect.deleteOne);
  const patchIntent = useDispatch(Designer.Intent.effect.patchOne, intent.id);

  const autoScrollListItem = useAutoScrollListItemIntoView();

  const onReorder = (items: RequiredEntity[]) => {
    patchIntent({ entityOrder: items.map(({ id }) => id) });
  };

  const onAddRequiredEntity = async (entityID: string) => {
    const requiredEntity = await createOne({ intentID: intent.id, entityID });

    autoScrollListItem.setItemID(requiredEntity.id);
  };

  const entityIDs = useMemo(() => requiredEntities.map(({ entityID }) => entityID), [requiredEntities]);

  return (
    <>
      <IntentRequiredEntitiesSection onAdd={onAddRequiredEntity} entityIDs={entityIDs}>
        <CMSFormSortableList
          items={requiredEntities}
          getItemKey={(item) => item.id}
          onItemsReorder={onReorder}
          renderItem={({ ref, item, dragContainerProps, styles }) => (
            <div {...dragContainerProps} ref={ref} style={{ transition: styles.transition }}>
              <CMSFormListItem pl={12} ref={autoScrollListItem.itemRef(item.id)} gap={4} align="center" onRemove={() => deleteOne(item.id)}>
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
