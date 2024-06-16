import { CUSTOM_SLOT_TYPE } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Box, Scroll, Section, Text, Tooltip } from '@voiceflow/ui-next';
import { isEntityVariantLikeEmpty } from '@voiceflow/utils-designer';
import React from 'react';

import { AIGenerateEntityVariant } from '@/components/AI/AIGenerateEntityVariantButton/AIGenerateEntityVariant.component';
import { useAIGenerateEntityVariants } from '@/components/AI/hooks/ai-generate-entity-variants.hook';
import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useEntityBulkImportVariantsModal } from '@/hooks/modal.hook';
import { stopPropagation } from '@/utils/handler.util';

import type { EntityVariantsSectionItem, IEntityVariantsSection } from './EntityVariantsSection.interface';

export const EntityVariantsSection = <T extends EntityVariantsSectionItem>({
  name,
  variants,
  disabled,
  classifier,
  onVariantAdd,
  onVariantRemove,
  renderVariantInput,
  onVariantImportMany,
  onVariantGeneratedMany,
  autoScrollToTopRevision,
}: IEntityVariantsSection<T>): React.ReactElement => {
  const TEST_ID = tid('entity', 'variants');

  const listEmpty = useIsListEmpty(variants, isEntityVariantLikeEmpty);
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const bulkImportVariantsModal = useEntityBulkImportVariantsModal();

  const aiGenerate = useAIGenerateEntityVariants({
    examples: variants,
    entityName: name,
    onGenerated: onVariantGeneratedMany,
    entityClassifier: classifier,
    successGeneratedMessage: 'Values generated',
  });

  const variantsSize = variants.length;

  return (
    <>
      <Section.Header.Container
        pt={11}
        pb={variantsSize ? 0 : 11}
        title="Values"
        testID={tid(TEST_ID, 'header')}
        variant={variantsSize ? 'active' : 'basic'}
        onHeaderClick={variantsSize ? undefined : onVariantAdd}
      >
        <Tooltip
          placement="top"
          referenceElement={({ ref, isOpen, onOpen, onClose }) => (
            <Section.Header.Button
              ref={ref}
              testID={tid(TEST_ID, 'bulk-import')}
              onClick={() => bulkImportVariantsModal.openVoid({ onImport: onVariantImportMany })}
              isActive={isOpen || bulkImportVariantsModal.opened}
              iconName="BulkUpload"
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
              tabIndex={-1}
            />
          )}
        >
          {() => (
            <Text variant="caption" breakWord>
              Bulk import
            </Text>
          )}
        </Tooltip>

        <Section.Header.Button
          testID={tid(TEST_ID, 'add')}
          onClick={stopPropagation(onVariantAdd)}
          disabled={disabled || aiGenerate.fetching}
          iconName="Plus"
        />
      </Section.Header.Container>

      {!!variantsSize && (
        <Scroll style={{ display: 'block' }} maxHeight="299px">
          <CMSFormCollapsibleList
            items={variants}
            testID={TEST_ID}
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
                onRemove={() => onVariantRemove(item.id)}
                removeDisabled={
                  (classifier === CUSTOM_SLOT_TYPE && variantsSize === 1) || disabled || aiGenerate.fetching
                }
                testID={tid(TEST_ID, 'list-item')}
              >
                {renderVariantInput({ item, disabled, onEmpty: listEmpty.container(virtualItem.index) })}
              </CMSFormVirtualListItem>
            )}
          />
        </Scroll>
      )}

      {aiFeaturesEnabled && !!variantsSize && (
        <Box px={16} pb={16} pt={8}>
          <AIGenerateEntityVariant
            testID={tid(TEST_ID, 'ai-generate')}
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
