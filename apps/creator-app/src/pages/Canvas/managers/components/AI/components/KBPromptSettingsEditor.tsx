import { SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import PromptSettings, { PromptSettingsProps } from './PromptSettings';

export const PromptSettingsEditor: React.FC<PromptSettingsProps<{ overrideParams?: boolean }>> = (props) => {
  const {
    data: { overrideParams },
    onChange,
  } = props;

  return (
    <>
      <SectionV2.Divider />
      <SectionV2.CollapseSection
        collapsed={!overrideParams}
        onToggle={() => onChange({ overrideParams: !overrideParams })}
        header={({ collapsed, onToggle }) => (
          <TippyTooltip
            width={208}
            content={
              <TippyTooltip.Multiline>
                <TippyTooltip.Title>{overrideParams ? 'Enabled' : 'Disabled'}</TippyTooltip.Title>
                {overrideParams
                  ? 'When toggled on, overrides the global prompt settings found in the Knowledge Base.'
                  : 'When toggled off, use the global prompt settings found in the Knowledge Base.'}
              </TippyTooltip.Multiline>
            }
            offset={[-16, -10]}
            display="block"
            placement="bottom-end"
          >
            <SectionV2.Header onClick={onToggle}>
              <SectionV2.Title bold={!collapsed}>Override prompt settings</SectionV2.Title>
              <Toggle size={Toggle.Size.EXTRA_SMALL} checked={overrideParams} />
            </SectionV2.Header>
          </TippyTooltip>
        )}
      >
        <PromptSettings {...props} pb={20} />
      </SectionV2.CollapseSection>
    </>
  );
};

export default PromptSettingsEditor;
