import { CUSTOM_SLOT_TYPE } from '@voiceflow/common';
import { Box, Scroll, Section } from '@voiceflow/ui-next';
import { isEntityVariantLikeEmpty } from '@voiceflow/utils-designer';
import React from 'react';

import { AIGenerateEntityVariant } from '@/components/AI/AIGenerateEntityVariantButton/AIGenerateEntityVariant.component';
import { useAIGenerateEntityVariants } from '@/components/AI/hooks/ai-generate-entity-variants.hook';
import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { useIsListEmpty } from '@/hooks/list.hook';
import { stopPropagation } from '@/utils/handler.util';

import type { EntityVariantsSectionItem, IEntityVariantsSection } from './EntityVariantsSection.interface';

export const EntityVariantsSection = <T extends EntityVariantsSectionItem>({
  name,
  onAdd,
  onRemove,
  variants,
  disabled,
  classifier,
  onGenerated,
  renderVariantInput,
  autoScrollToTopRevision,
}: IEntityVariantsSection<T>): React.ReactElement => {
  const listEmpty = useIsListEmpty(variants, isEntityVariantLikeEmpty);
  const aiGenerate = useAIGenerateEntityVariants({
    examples: variants,
    entityName: name,
    onGenerated,
    entityClassifier: classifier,
    successGeneratedMessage: 'Values generated',
  });

  const variantsSize = variants.length;

  return (
    <>
      <Box pt={11} pb={variantsSize ? 0 : 11}>
        <Section.Header.Container title="Values" variant={variantsSize ? 'active' : 'basic'} onHeaderClick={variantsSize ? undefined : onAdd}>
          <Section.Header.Button onClick={stopPropagation(onAdd)} disabled={disabled || aiGenerate.fetching} iconName="Plus" />
        </Section.Header.Container>
      </Box>

      {!!variantsSize && (
        <Scroll style={{ display: 'block' }} maxHeight="299px">
          <CMSFormCollapsibleList
            items={variants}
            itemsLimit={5}
            collapseLabel="values"
            estimatedItemSize={53}
            autoScrollToTopRevision={autoScrollToTopRevision}
            renderItem={({ item, virtualizer, virtualItem }) => (
              <CMSFormVirtualListItem
                pt={9}
                pb={7}
                ref={virtualizer.measureElement}
                key={virtualItem.key}
                index={virtualItem.index}
                onRemove={() => onRemove(item.id)}
                removeDisabled={(classifier === CUSTOM_SLOT_TYPE && variantsSize === 1) || disabled || aiGenerate.fetching}
              >
                {renderVariantInput({ item, disabled, onEmpty: listEmpty.container(virtualItem.index) })}
              </CMSFormVirtualListItem>
            )}
          />
        </Scroll>
      )}

      {!!variantsSize && (
        <Box px={16} pb={16} pt={8}>
          <AIGenerateEntityVariant
            disabled={disabled || aiGenerate.fetching}
            isLoading={aiGenerate.fetching}
            onGenerate={aiGenerate.onGenerate}
            hasExtraContext={!!name || !!classifier || !listEmpty.value}
          />
        </Box>
      )}
    </>
  );
};
