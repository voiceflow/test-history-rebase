import { Box, Divider, Gauge, Section, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { getIntentConfidenceLevel, getIntentConfidenceProgress } from '@/utils/intent.util';

import { IntentDropdown } from '../IntentDropdown/IntentDropdown.component';
import { IntentEditAutomaticRepromptSection } from '../IntentEditAutomaticRepromptSection/IntentEditAutomaticRepromptSection.component';
import type { IIntentEditPopper } from './IntentEditPopper.interface';

export const IntentEditPopper: React.FC<IIntentEditPopper> = ({ intentID, onIntentSelect }) => {
  const utterancesCount = useSelector(Designer.Intent.Utterance.selectors.countByIntentID, { intentID });

  return (
    <Surface pt={11} width="300px">
      <Section.Header.Container
        title="Intent"
        variant="active"
        primaryContent={
          <Box width="42px">
            <Gauge level={getIntentConfidenceLevel(utterancesCount)} progress={getIntentConfidenceProgress(utterancesCount)} />
          </Box>
        }
      />

      <Box px={24} pb={20}>
        <IntentDropdown intentID={intentID} onIntentSelect={onIntentSelect} />
      </Box>

      <Divider />

      {/* TODO: add required entity */}

      <IntentEditAutomaticRepromptSection intentID={intentID} />
    </Surface>
  );
};
