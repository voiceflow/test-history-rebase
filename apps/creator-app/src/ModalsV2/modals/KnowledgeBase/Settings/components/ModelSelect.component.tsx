import { BaseUtils } from '@voiceflow/base-types';
import { AIGPTModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';
import { Box, Dropdown, HotKeys, Menu, MenuItem, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { PRIVATE_LLM_MODELS } from '@/config';
import * as Documentation from '@/config/documentation';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

import * as C from '../Settings.constant';
import { SettingsLabel } from './SettingLabel.component';

export interface IModelSelect {
  model?: AIGPTModel;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

export const ModelSelect: React.FC<IModelSelect> = ({ model = BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo, onChange }) => {
  const advancedLLMModels = usePermission(Permission.ADVANCED_LLM_MODELS);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const upgradeModal = useUpgradeModal();

  const isReverseTrial = isTrial && !isEnterprise;

  return (
    <Box width="100%" direction="column" pb={12}>
      <SettingsLabel
        label="AI model"
        tooltipText="The large language model (LLM) your agent will use to fetch and compile data."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <Dropdown value={C.MODEL_LABELS[model].name} prefixIconName={C.MODEL_LABELS[model].icon as IconName} variant="primary">
        {({ referenceRef, onClose }) => (
          <Menu width={`max(100%, ${referenceRef.current?.clientWidth ?? 0}px)`}>
            {(Object.keys(C.MODEL_LABELS) as AIGPTModel[])
              .filter((model) => {
                if (PRIVATE_LLM_MODELS) return PRIVATE_LLM_MODELS.has(model);
                return true;
              })
              .map((model) => {
                const disabled = (!advancedLLMModels.allowed || isReverseTrial) && C.ADVANCED_LLM_MODELS.has(model);

                const onSelect = () => {
                  if (disabled) return;
                  onChange({ model: model as BaseUtils.ai.GPT_MODEL });
                  onClose();
                };

                const modalConfig = C.getUpgradeModelConfig({ model });

                if (disabled) {
                  return (
                    <Tooltip
                      key={C.MODEL_LABELS[model].name}
                      width={160}
                      placement="left"
                      referenceElement={({ onToggle, ref }) => (
                        <MenuItem
                          ref={ref}
                          onMouseEnter={onToggle}
                          onMouseLeave={onToggle}
                          key={C.MODEL_LABELS[model].name}
                          label={C.MODEL_LABELS[model].name}
                          prefixIconName={C.MODEL_LABELS[model].icon as IconName}
                          hotKeys={<HotKeys hotKeys={[{ label: C.MODEL_LABELS[model].info }]} />}
                          disabled={disabled}
                          onClick={onSelect}
                        />
                      )}
                    >
                      {() => (
                        <Box direction="column">
                          <Tooltip.Caption>This model can only be used on a paid plan.</Tooltip.Caption>
                          <Tooltip.Button onClick={() => upgradeModal.openVoid(modalConfig)}>Upgrade</Tooltip.Button>
                        </Box>
                      )}
                    </Tooltip>
                  );
                }

                return (
                  <MenuItem
                    key={C.MODEL_LABELS[model].name}
                    label={C.MODEL_LABELS[model].name}
                    prefixIconName={C.MODEL_LABELS[model].icon as IconName}
                    hotKeys={<HotKeys hotKeys={[{ label: C.MODEL_LABELS[model].info }]} />}
                    disabled={disabled}
                    onClick={onSelect}
                  />
                );
              })}
          </Menu>
        )}
      </Dropdown>
    </Box>
  );
};
