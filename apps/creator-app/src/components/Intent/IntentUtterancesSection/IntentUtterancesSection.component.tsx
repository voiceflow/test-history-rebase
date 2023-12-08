import { UtteranceText } from '@voiceflow/dtos';
import { Box, Gauge, Scroll, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { stopPropagation } from '@/utils/handler.util';
import { getIntentConfidenceLevel, getIntentConfidenceProgress } from '@/utils/intent.util';
import { isUtteranceTextEmpty } from '@/utils/utterance.util';

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
  autoScrollToTopRevision,
}) => {
  const utterancesSize = utterances.length;

  const onUtteranceEnterPress = (event: React.KeyboardEvent<HTMLDivElement>, value: UtteranceText) => {
    if (isUtteranceTextEmpty(value)) return;

    onUtteranceAdd();
    event.currentTarget.blur();
  };

  return (
    <>
      <Box pt={11} pb={utterancesSize ? 8 : 11} direction="column">
        <Section.Header.Container
          title="Utterances"
          variant={utterancesSize ? 'active' : 'basic'}
          onHeaderClick={utterancesSize ? undefined : onUtteranceAdd}
          primaryContent={
            utterancesSize ? (
              <Box width="42px">
                <Gauge level={getIntentConfidenceLevel(utterancesSize)} progress={getIntentConfidenceProgress(utterancesSize)} />
              </Box>
            ) : undefined
          }
        >
          <Section.Header.Button iconName="Plus" onClick={stopPropagation(onUtteranceAdd)} />
        </Section.Header.Container>
      </Box>

      <Scroll style={{ display: 'block' }} maxHeight="394px">
        <CMSFormCollapsibleList
          items={utterances}
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
              align="center"
              onRemove={() => onUtteranceRemove(item.id)}
              removeDisabled={utterancesSize === 1}
            >
              <IntentUtteranceInput
                value={item.text}
                error={virtualItem.index === 0 ? utterancesError : undefined}
                autoFocus={item.id === autoFocusKey}
                onEnterPress={onUtteranceEnterPress}
                onValueEmpty={onUtteranceEmpty(virtualItem.index)}
                onValueChange={(text) => onUtteranceChange(item.id, { text })}
              />
            </CMSFormVirtualListItem>
          )}
        />
      </Scroll>
    </>
  );
};
