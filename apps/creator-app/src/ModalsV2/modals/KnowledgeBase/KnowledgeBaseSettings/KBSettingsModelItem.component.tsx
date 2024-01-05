import { Box, HotKeys, Menu, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { ADVANCED_AI_MODELS, AIModelConfig } from '@/config/ai-model';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

export interface IKBSettingsModelItem {
  model: AIModelConfig;
  onClick: VoidFunction;
}

export const KBSettingsModelItem: React.FC<IKBSettingsModelItem> = ({ model, onClick }) => {
  const advancedLLMModelsPermission = usePermission(Permission.ADVANCED_LLM_MODELS);

  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);

  const upgradeModal = useUpgradeModal();

  const isReverseTrial = isTrial && !isEnterprise;

  const locked = (!advancedLLMModelsPermission.allowed || isReverseTrial) && ADVANCED_AI_MODELS.has(model.type);

  if (model.hidden) return null;

  if (locked) {
    return (
      <MenuItemWithTooltip
        label={model.name}
        hotKeys={<HotKeys hotKeys={[{ label: model.info }]} />}
        tooltip={{ width: 160, placement: 'left' }}
        disabled
        prefixIconName={model.icon}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>This model can only be used on a paid plan.</Tooltip.Caption>

            <Tooltip.Button
              onClick={() =>
                advancedLLMModelsPermission.planConfig &&
                upgradeModal.openVoid(advancedLLMModelsPermission.planConfig.upgradeModal({ modelType: model.type }))
              }
            >
              Upgrade
            </Tooltip.Button>
          </Box>
        )}
      </MenuItemWithTooltip>
    );
  }

  return (
    <Menu.Item
      label={model.name}
      hotKeys={<HotKeys hotKeys={[{ label: model.info }]} />}
      onClick={onClick}
      disabled={model.disabled}
      prefixIconName={model.icon}
    />
  );
};
