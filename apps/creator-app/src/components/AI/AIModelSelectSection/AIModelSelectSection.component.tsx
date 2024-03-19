import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { AIModelSelect } from '../AIModelSelect/AIModelSelect.component';
import { IAIModelSelectSection } from './AIModelSelectSection.interface';

export const AIModelSelectSection: React.FC<IAIModelSelectSection> = ({ learnMoreURL, ...props }) => (
  <Box direction="column">
    <Section.Header.Container
      variant="active"
      contentProps={{ pr: 24 }}
      title={(className) => (
        <SectionHeaderTitleWithLearnTooltip title="AI model" className={className} onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}>
          The large language model (LLM) your agent will use to fetch and compile data.
        </SectionHeaderTitleWithLearnTooltip>
      )}
    />

    <Box px={24} direction="column">
      <AIModelSelect {...props} />
    </Box>
  </Box>
);
