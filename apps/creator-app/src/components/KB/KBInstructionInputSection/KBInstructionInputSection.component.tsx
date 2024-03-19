import { Box, Section, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useLinkedState } from '@/hooks/state.hook';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { IKBInstructionInputSection } from './KBInstructionInputSection.interface';

export const KBInstructionInputSection: React.FC<IKBInstructionInputSection> = ({
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
          <SectionHeaderTitleWithLearnTooltip title="Instructions" className={className} onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}>
            This field is optional. You can use it to add custom instructions to your prompt.
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
          placeholder="Enter LLM instructions"
          onValueChange={setValue}
        />
      </Box>
    </Box>
  );
};
