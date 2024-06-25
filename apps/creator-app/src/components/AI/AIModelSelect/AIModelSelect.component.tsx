import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Dropdown, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { AI_MODEL_CONFIG_MAP, ANTHROPIC_MODEL_CONFIGS, OPEN_AI_MODEL_CONFIGS } from '@/config/ai-model';

import type { IAIModelSelect } from './AIModelSelect.interface';
import { AIModelSelectItem } from './AIModelSelectItem.component';

export const AIModelSelect: React.FC<IAIModelSelect> = ({
  label,
  value,
  testID = 'ai-model-select',
  disabled,
  onValueChange,
}) => {
  const modelConfig = AI_MODEL_CONFIG_MAP[value];

  return (
    <Dropdown
      label={label}
      value={modelConfig.name}
      disabled={disabled}
      prefixIconName={modelConfig.icon}
      testID={testID}
    >
      {({ onClose }) => (
        <Menu>
          {OPEN_AI_MODEL_CONFIGS.map((model) => (
            <AIModelSelectItem
              key={model.type}
              model={model}
              testID={tid(testID, 'item', model.type)}
              onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))}
            />
          ))}

          <Menu.Divider />

          {ANTHROPIC_MODEL_CONFIGS.map((model) => (
            <AIModelSelectItem
              key={model.type}
              model={model}
              testID={tid(testID, 'item', model.type)}
              onClick={Utils.functional.chainVoid(onClose, () => onValueChange(model.type))}
            />
          ))}
        </Menu>
      )}
    </Dropdown>
  );
};
