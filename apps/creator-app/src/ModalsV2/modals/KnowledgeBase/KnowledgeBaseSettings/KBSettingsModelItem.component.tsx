import { tid } from '@voiceflow/style';
import { BaseProps, Box, HotKeys, Menu, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { AIModelConfig } from '@/config/ai-model';
import { getAdvancedAiModelUpgradeModal } from '@/config/planPermission/advancedAIModels';
import { useAIModelEntitlement } from '@/hooks';
import { useUpgradeModal } from '@/hooks/modal.hook';

export interface IKBSettingsModelItem extends BaseProps {
  model: AIModelConfig;
  onClick: VoidFunction;
}

export const KBSettingsModelItem: React.FC<IKBSettingsModelItem> = ({ model, onClick, testID }) => {
  const aiModelEntitlement = useAIModelEntitlement();
  const upgradeModal = useUpgradeModal();

  const locked = !aiModelEntitlement.isAllowed(model.type);

  if (model.hidden) return null;

  if (locked) {
    return (
      <MenuItemWithTooltip
        label={model.name}
        hotKeys={<HotKeys hotKeys={[{ label: model.info }]} />}
        tooltip={{ width: 160, placement: 'left', modifiers: [{ name: 'offset', options: { offset: [16, 5] } }] }}
        disabled
        prefixIconName={model.icon}
        testID={testID}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>This model can only be used on a paid plan.</Tooltip.Caption>

            <Tooltip.Button onClick={() => upgradeModal.openVoid(getAdvancedAiModelUpgradeModal(model.type))} testID={tid(testID, 'upgrade')}>
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
