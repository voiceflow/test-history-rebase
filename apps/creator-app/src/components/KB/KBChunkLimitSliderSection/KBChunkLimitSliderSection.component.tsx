import { Box, Section } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { KBChunkLimitSlider } from '../KBChunkLimitSlider/KBChunkLimitSlider.component';
import { IKBChunkLimitSliderSection } from './KBChunkLimitSliderSection.interface';

export const KBChunkLimitSliderSection: React.FC<IKBChunkLimitSliderSection> = ({
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
            width={212}
            title="Chunk limit"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            Determines how many data source chunks will be passed to the LLM as context to generate a response. We recommend 2-3 to avoid LLM
            confusion.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{value}</Section.Header.Caption>
      </Section.Header.Container>

      <Box pt={2} px={24} direction="column">
        <KBChunkLimitSlider value={value} onValueSave={onPropValueChange} onValueChange={setValue} {...props} />
      </Box>
    </Box>
  );
};
