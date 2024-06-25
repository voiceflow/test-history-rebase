import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { NLUConfidenceSlider } from '../NLUConfidenceSlider/NLUConfidenceSlider.component';
import type { INLUConfidenceSliderSection } from './NLUConfidenceSliderSection.interface';

export const NLUConfidenceSliderSection: React.FC<INLUConfidenceSliderSection> = ({
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
            title="Intent confidence threshold"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            The threshold of confidence needed to classify an intent.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{value.toFixed(2)}</Section.Header.Caption>
      </Section.Header.Container>

      <Box pt={2} px={24} direction="column">
        <NLUConfidenceSlider value={value} onValueSave={onPropValueChange} onValueChange={setValue} {...props} />
      </Box>
    </Box>
  );
};
