import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { AIMaxTokensSlider } from '../AIMaxTokensSlider/AIMaxTokensSlider.component';
import type { IAIMaxTokensSliderSection } from './AIMaxTokensSliderSection.interface';

export const AIMaxTokensSliderSection: React.FC<IAIMaxTokensSliderSection> = ({
  value: propValue,
  learnMoreURL,
  onValueChange: onPropValueChange,
  ...props
}) => {
  const { maxTokens } = AI_MODEL_CONFIG_MAP[props.model];

  const [value, setValue] = useLinkedState(Math.min(propValue, maxTokens));

  return (
    <Box direction="column">
      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Max tokens"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            The maximum number of tokens that can be used to generate a single response.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{value}</Section.Header.Caption>
      </Section.Header.Container>

      <Box pt={2} px={24} direction="column">
        <AIMaxTokensSlider
          value={value}
          limit={maxTokens}
          onValueSave={onPropValueChange}
          onValueChange={setValue}
          {...props}
        />
      </Box>
    </Box>
  );
};
