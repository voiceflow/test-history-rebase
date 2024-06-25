import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { AITemperatureSlider } from '../AITemperatureSlider/AITemperatureSlider.component';
import type { IAITemperatureSliderSection } from './AITemperatureSliderSection.interface';

export const AITemperatureSliderSection: React.FC<IAITemperatureSliderSection> = ({
  value: propValue,
  learnMoreURL,
  onValueChange: onPropValueChange,
  ...props
}) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box direction="column">
      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Temperature"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            Control the randomness of the answer the LLM provides.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{value.toFixed(2)}</Section.Header.Caption>
      </Section.Header.Container>

      <Box pt={2} px={24} direction="column">
        <AITemperatureSlider value={value} onValueSave={onPropValueChange} onValueChange={setValue} {...props} />
      </Box>
    </Box>
  );
};
