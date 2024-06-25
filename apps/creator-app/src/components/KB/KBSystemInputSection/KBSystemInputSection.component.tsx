import { Box, Section, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import type { IKBSystemInputSection } from './KBSystemInputSection.interface';

export const KBSystemInputSection: React.FC<IKBSystemInputSection> = ({
  value: propValue,
  testID,
  maxRows = 16,
  disabled,
  learnMoreURL,
  onValueChange: onPropValueChange,
}) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box direction="column">
      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="System"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            Give the system a role that it should play when creating your answers.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      />

      <Box px={24} direction="column">
        <TextArea
          value={value}
          testID={testID}
          onBlur={() => onPropValueChange(value)}
          minRows={1}
          maxRows={maxRows}
          disabled={disabled}
          placeholder="Enter system persona"
          onValueChange={setValue}
        />
      </Box>
    </Box>
  );
};
