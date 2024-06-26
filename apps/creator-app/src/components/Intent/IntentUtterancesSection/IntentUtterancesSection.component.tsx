import type { UtteranceText } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Scroll, Section, Text, Tooltip } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { useIntentBulkImportUtterancesModal } from '@/hooks/modal.hook';
import { stopPropagation } from '@/utils/handler.util';
import { isUtteranceTextEmpty } from '@/utils/utterance.util';

import { IntentConfidenceGauge } from '../IntentConfidenceGauge/IntentConfidenceGauge.component';
import { IntentUtteranceInput } from '../IntentUtteranceInput/IntentUtteranceInput.component';
import type { IIntentUtterancesSection } from './IntentUtterancesSection.interface';

export const IntentUtterancesSection: React.FC<IIntentUtterancesSection> = ({
  utterances,
  autoFocusKey,
  onUtteranceAdd,
  utterancesError,
  onUtteranceEmpty,
  onUtteranceChange,
  onUtteranceRemove,
  onRequiredEntityAdd,
  onUtteranceImportMany,
  autoScrollToTopRevision,
}) => {
  const TEST_ID = tid('intent', 'utterances');

  const bulkImportUtterancesModal = useIntentBulkImportUtterancesModal();

  const onUtteranceEnterPress = (event: React.KeyboardEvent<HTMLDivElement>, value: UtteranceText) => {
    if (isUtteranceTextEmpty(value)) return;

    onUtteranceAdd();
    event.currentTarget.blur();
  };

  const utterancesSize = utterances.length;
  const notEmptyUtterances = useMemo(
    () => utterances.filter((utterance) => !isUtteranceTextEmpty(utterance.text)),
    [utterances]
  );

  return (
    <>
      <Section.Header.Container
        pt={11}
        pb={utterancesSize ? 0 : 11}
        title="Utterances"
        testID={tid(TEST_ID, 'header')}
        variant={utterancesSize ? 'active' : 'basic'}
        onHeaderClick={utterancesSize ? undefined : onUtteranceAdd}
        primaryContent={
          utterancesSize ? <IntentConfidenceGauge nonEmptyUtterancesCount={notEmptyUtterances.length} /> : undefined
        }
      >
        <Tooltip
          placement="top"
          referenceElement={({ ref, isOpen, onOpen, onClose }) => (
            <Section.Header.Button
              ref={ref}
              onClick={() => bulkImportUtterancesModal.openVoid({ onImport: onUtteranceImportMany })}
              testID={tid(TEST_ID, 'bulk-import')}
              isActive={isOpen || bulkImportUtterancesModal.opened}
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
          iconName="Plus"
          onClick={stopPropagation(onUtteranceAdd)}
          testID={tid(TEST_ID, 'add')}
          tabIndex={-1}
        />
      </Section.Header.Container>

      <Scroll style={{ display: 'block' }} maxHeight="394px">
        <CMSFormCollapsibleList
          items={utterances}
          testID={TEST_ID}
          collapseLabel="sample phrases"
          estimatedItemSize={36}
          autoScrollToTopRevision={autoScrollToTopRevision}
          renderItem={({ item, virtualizer, virtualItem }) => (
            <CMSFormVirtualListItem
              py={2}
              ref={virtualizer.measureElement}
              key={virtualItem.key}
              gap={8}
              index={virtualItem.index}
              align="start"
              onRemove={() => onUtteranceRemove(item.id)}
              removeDisabled={utterancesSize === 1}
              contentContainerProps={{ pt: 6 }}
              testID={tid(TEST_ID, 'item')}
            >
              <IntentUtteranceInput
                value={item.text}
                error={virtualItem.index === 0 ? utterancesError : undefined}
                autoFocus={item.id === autoFocusKey}
                onEnterPress={onUtteranceEnterPress}
                onValueEmpty={onUtteranceEmpty(virtualItem.index)}
                onValueChange={(text) => onUtteranceChange(item.id, { text })}
                onEntityAdded={onRequiredEntityAdd}
                testID={tid(TEST_ID, ['item', 'input'])}
              />
            </CMSFormVirtualListItem>
          )}
        />
      </Scroll>
    </>
  );
};
