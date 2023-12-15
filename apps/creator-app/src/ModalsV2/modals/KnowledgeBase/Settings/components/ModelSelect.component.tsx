import { BaseUtils } from '@voiceflow/base-types';
import { AIGPTModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';
import { Box, Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import * as C from '../Settings.constant';
import { ModelMenu } from './ModelMenuItem.component';
import { SettingsLabel } from './SettingLabel.component';

export interface IModelSelect {
  model?: AIGPTModel;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

export const ModelSelect: React.FC<IModelSelect> = ({ model = BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo, onChange }) => {
  return (
    <Box width="100%" direction="column" pb={12}>
      <SettingsLabel
        label="AI model"
        tooltipText="The large language model (LLM) your agent will use to fetch and compile data."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <Dropdown value={C.MODEL_LABELS[model].name} prefixIconName={C.MODEL_LABELS[model].icon as IconName} variant="primary">
        {({ referenceRef, onClose }) => <ModelMenu referenceRef={referenceRef} onChange={onChange} onClose={onClose} />}
      </Dropdown>
    </Box>
  );
};
