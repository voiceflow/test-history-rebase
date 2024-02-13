import { tid } from '@voiceflow/style';
import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { useLinkedState } from '@/hooks/state.hook';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsInstructions {
  value: string;
  disabled?: boolean;
  className?: string;
  maxRows?: number;
  activeTooltipLabel?: string | null;
  onValueChange: (system: string) => void;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
  onValueType?: (system: string) => void;
}

export const KBSettingsInstructions: React.FC<IKBSettingsInstructions> = ({
  value: propValue,
  disabled,
  maxRows = 12,
  className,
  activeTooltipLabel,
  setTooltipActiveLabel,
  onValueChange,
  onValueType,
}) => {
  const TEST_ID = tid(SETTINGS_TEST_ID, 'instructions');

  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="Instructions"
        tooltipText="This field is optional. You can use it to add custom instructions to your prompt."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        activeTooltipLabel={activeTooltipLabel}
        setTooltipActiveLabel={setTooltipActiveLabel}
      />

      <Box pl={24}>
        <TextArea
          value={value}
          onBlur={() => onValueChange(value)}
          onChange={(event) => onValueType?.(event.target.value)}
          minRows={1}
          maxRows={maxRows}
          disabled={disabled}
          className={className}
          placeholder="Enter LLM instructions"
          onValueChange={setValue}
          testID={TEST_ID}
        />
      </Box>
    </Box>
  );
};
