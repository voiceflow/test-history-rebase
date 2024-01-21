import { SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import { AIPromptSettings, IAIPromptSettings } from '@/components/AI/AIPromptSettings/AIPromptSettings.component';

interface IKBPromptSettingsEditor extends IAIPromptSettings {
  value: IAIPromptSettings['value'] & { overrideParams?: boolean };
  onValueChange: (data: Partial<IAIPromptSettings['value'] & { overrideParams?: boolean }>) => void;
}

export const KBPromptSettingsEditor: React.FC<IKBPromptSettingsEditor> = ({ value, containerProps, onValueChange }) => {
  const { overrideParams } = value;

  return (
    <>
      <SectionV2.Divider />

      <SectionV2.CollapseSection
        onToggle={() => onValueChange({ overrideParams: !overrideParams })}
        collapsed={!overrideParams}
        header={({ collapsed, onToggle }) => (
          <TippyTooltip
            width={208}
            offset={[-16, -10]}
            display="block"
            placement="bottom-end"
            content={
              <TippyTooltip.Multiline>
                <TippyTooltip.Title>{overrideParams ? 'Enabled' : 'Disabled'}</TippyTooltip.Title>
                {overrideParams
                  ? 'When toggled on, overrides the global prompt settings found in the Knowledge Base.'
                  : 'When toggled off, use the global prompt settings found in the Knowledge Base.'}
              </TippyTooltip.Multiline>
            }
          >
            <SectionV2.Header onClick={onToggle}>
              <SectionV2.Title bold={!collapsed}>Override prompt settings</SectionV2.Title>
              <Toggle size={Toggle.Size.EXTRA_SMALL} checked={overrideParams} />
            </SectionV2.Header>
          </TippyTooltip>
        )}
      >
        <AIPromptSettings value={value} onValueChange={onValueChange} containerProps={{ ...containerProps, pb: 20 }} />
      </SectionV2.CollapseSection>
    </>
  );
};
