import { Box, Gauge, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormScrollSection } from '@/components/CMS/CMSForm/CMSFormScrollSection/CMSFormScrollSection.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
import { getIntentConfidenceLevel, getIntentConfidenceProgress } from '@/utils/intent.util';

import { IntentUtteranceInput } from '../IntentUtteranceInput/IntentUtteranceInput.component';
import type { IIntentUtterancesSection } from './IntentUtterancesSection.interface';

export const IntentUtterancesSection: React.FC<IIntentUtterancesSection> = ({
  utterances,
  autoFocusKey,
  onUtteranceAdd,
  onUtteranceEmpty,
  onUtteranceChange,
  onUtteranceDelete,
  autoScrollToTopRevision,
}) => (
  <CMSFormScrollSection
    pb={8}
    minHeight="91px"
    header={
      <Section.Header.Container
        title="Utterances"
        variant="active"
        primaryContent={
          <Box width="42px">
            <Gauge level={getIntentConfidenceLevel(utterances.length)} progress={getIntentConfidenceProgress(utterances.length)} />
          </Box>
        }
      >
        <Section.Header.Button iconName="Plus" onClick={() => onUtteranceAdd()} />
      </Section.Header.Container>
    }
  >
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
          index={virtualItem.index}
          onRemove={() => onUtteranceDelete(item.id)}
          removeDisabled={utterances.length === 1}
        >
          <IntentUtteranceInput
            value={item.text}
            autoFocus={item.id === autoFocusKey}
            onValueEmpty={onUtteranceEmpty(virtualItem.index)}
            onValueChange={(text) => onUtteranceChange(item.id, { text })}
          />
        </CMSFormVirtualListItem>
      )}
    />
  </CMSFormScrollSection>
);
