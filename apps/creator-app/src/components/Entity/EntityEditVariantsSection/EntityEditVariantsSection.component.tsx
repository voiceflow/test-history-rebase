import { Box } from '@voiceflow/ui-next';
import { isEntityVariantLikeEmpty } from '@voiceflow/utils-designer';
import React from 'react';

import { AIGenerateEntityVariant } from '@/components/AI/AIGenerateEntityVariantButton/AIGenerateEntityVariant.component';
import { useAIGenerateEntityVariants } from '@/components/AI/hooks/ai-generate-entity-variants.hook';
import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { EntityVariantInput } from '../EntityVariantInput/EntityVariantInput.component';
import { EntityVariantsSection } from '../EntityVariantsSection/EntityVariantsSection.component';
import type { IEntityEditVariantsSection } from './EntityEditVariantsSection.interface';

export const EntityEditVariantsSection: React.FC<IEntityEditVariantsSection> = ({ entityID }) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const variants = useSelector(Designer.Entity.EntityVariant.selectors.allByEntityID, { entityID });

  const patchOne = useDispatch(Designer.Entity.EntityVariant.effect.patchOne);
  const createOne = useDispatch(Designer.Entity.EntityVariant.effect.createOne, entityID);
  const deleteOne = useDispatch(Designer.Entity.EntityVariant.effect.deleteOne);
  const createMany = useDispatch(Designer.Entity.EntityVariant.effect.createMany, entityID);

  const aiGenerate = useAIGenerateEntityVariants({
    examples: variants,
    entityName: entity?.name ?? '',
    entityType: entity?.classifier ?? '',
    onGenerated: createMany,
  });

  const [isListEmpty, onListItemEmpty] = useIsListEmpty(variants, isEntityVariantLikeEmpty);
  const [autoFocusKey, setAutoFocusKey] = useInputAutoFocusKey();

  const onAddVariant = async () => {
    const variant = await createOne({ value: '', synonyms: [] });

    setAutoFocusKey(variant.id);
  };

  return (
    <>
      <EntityVariantsSection onAdd={onAddVariant}>
        <CMSFormCollapsibleList
          items={variants}
          itemsLimit={5}
          collapseLabel="values"
          estimatedItemSize={53}
          autoScrollToTopRevision={autoFocusKey}
          renderItem={({ item, virtualizer, virtualItem }) => (
            <CMSFormVirtualListItem
              pt={9}
              pb={7}
              ref={virtualizer.measureElement}
              key={virtualItem.key}
              align="center"
              index={virtualItem.index}
              onRemove={variants.length === 1 ? null : () => deleteOne(item.id)}
            >
              <EntityVariantInput
                value={item.value}
                onEmpty={onListItemEmpty(virtualItem.index)}
                synonyms={item.synonyms}
                autoFocus={item.id === autoFocusKey}
                onValueChange={(value) => patchOne(item.id, { value })}
                onSynonymsChange={(synonyms) => patchOne(item.id, { synonyms })}
              />
            </CMSFormVirtualListItem>
          )}
        />
      </EntityVariantsSection>

      <Box px={16} pb={16}>
        <AIGenerateEntityVariant isLoading={aiGenerate.fetching} onGenerate={aiGenerate.onGenerate} hasExtraContext={!!entity || !isListEmpty} />
      </Box>
    </>
  );
};
