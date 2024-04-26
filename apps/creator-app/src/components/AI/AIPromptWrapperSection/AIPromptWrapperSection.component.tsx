import { tid } from '@voiceflow/style';
import { Box, Link, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CodePreviewWithFullScreenEditor } from '@/components/Code/CodePreviewWithFullScreenEditor/CodePreviewWithFullScreenEditor.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import type { IAIPromptWrapperSection } from './AIPromptWrapperSection.interface';

export const AIPromptWrapperSection: React.FC<IAIPromptWrapperSection> = ({
  value,
  testID,
  disabled,
  defaultValue,
  learnMoreURL,
  onValueChange,
  onResetToDefault,
  onCodeEditorToggle,
}) => {
  return (
    <Box direction="column">
      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Prompt"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(learnMoreURL)}
          >
            Modify the wrapper prompt to tailor the agent's context and instructions for your specific use case.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        {value !== defaultValue && (
          <Link
            size="small"
            label="Reset"
            testID={tid(testID, 'reset')}
            weight="semiBold"
            onClick={onResetToDefault}
            disabled={disabled}
          />
        )}
      </Section.Header.Container>

      <Box px={24} direction="column">
        <CodePreviewWithFullScreenEditor
          code={value}
          testID={tid(testID, 'editor')}
          disabled={disabled}
          onCodeChange={onValueChange}
          isFunctionEditor
          headerButtonProps={{ iconName: 'Question', onClick: onOpenURLInANewTabFactory(learnMoreURL) }}
          onCodeEditorToggle={onCodeEditorToggle}
          autoFocusLineNumber={2}
        />
      </Box>
    </Box>
  );
};
