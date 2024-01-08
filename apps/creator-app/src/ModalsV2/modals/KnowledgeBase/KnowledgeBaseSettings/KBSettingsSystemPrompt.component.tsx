import { Box, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { useLinkedState } from '@/hooks/state.hook';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsSystemPrompt {
  value: string;
  disabled?: boolean;
  className?: string;
  onValueChange: (system: string) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsSystemPrompt: React.FC<IKBSettingsSystemPrompt> = ({
  value: propValue,
  disabled,
  className,
  activeTooltipLabel,
  setTooltipActiveLabel,
  onValueChange,
}) => {
  const [value, setValue] = useLinkedState(propValue);

  return (
    <Box width="100%" direction="column">
      <KBSettingLabel
        label="System"
        tooltipText="Give the system a role that it should play when creating your answers."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        activeTooltipLabel={activeTooltipLabel}
        setTooltipActiveLabel={setTooltipActiveLabel}
      />

      <Box pl={24}>
        <TextArea
          value={value}
          onBlur={() => onValueChange(value)}
          minRows={1}
          disabled={disabled}
          className={className}
          placeholder="Enter system persona"
          onValueChange={setValue}
        />
      </Box>
    </Box>
  );
};
