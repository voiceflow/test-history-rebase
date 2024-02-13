import { Utils } from '@voiceflow/common';
import { AIModel } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Dropdown, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { AI_MODEL_CONFIG_MAP, ANTHROPIC_MODEL_CONFIGS, OPEN_AI_MODEL_CONFIGS } from '@/config/ai-model';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingLabel } from './KBSettingLabel.component';
import { KBSettingsModelItem } from './KBSettingsModelItem.component';

export interface IKBSettingsModelSelect {
  value: AIModel;
  disabled?: boolean;
  onValueChange: (model: AIModel) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsModelSelect: React.FC<IKBSettingsModelSelect> = ({
  value,
  disabled,
  activeTooltipLabel,
  setTooltipActiveLabel,
  onValueChange,
}) => {
  const TEST_ID = tid(SETTINGS_TEST_ID, 'model');

  const modelConfig = AI_MODEL_CONFIG_MAP[value];

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="AI model"
        tooltipText="The large language model (LLM) your agent will use to fetch and compile data."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        activeTooltipLabel={activeTooltipLabel}
        setTooltipActiveLabel={setTooltipActiveLabel}
      />

      <Box pl={24}>
        <Dropdown value={modelConfig.name} disabled={disabled} prefixIconName={modelConfig.icon} testID={TEST_ID}>
          {({ onClose }) => (
            <Menu>
              {OPEN_AI_MODEL_CONFIGS.map((model) => (
                <KBSettingsModelItem
                  key={model.type}
                  model={model}
                  onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))}
                  testID={tid(TEST_ID, 'item', model.type)}
                />
              ))}

              <Menu.Divider />

              {ANTHROPIC_MODEL_CONFIGS.map((model) => (
                <KBSettingsModelItem
                  key={model.type}
                  model={model}
                  onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))}
                  testID={tid(TEST_ID, 'item', model.type)}
                />
              ))}
            </Menu>
          )}
        </Dropdown>
      </Box>
    </Box>
  );
};
