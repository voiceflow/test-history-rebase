import { tid } from '@voiceflow/style';
import { Box, HotKeys, Menu, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { getAdvancedAiModelUpgradeModal } from '@/config/planPermission/advancedAIModels';
import { useAIModelEntitlement } from '@/hooks/entitlements.hook';
import { useUpgradeModal } from '@/hooks/modal.hook';

import { IAIModelSelectItem } from './AIModelSelect.interface';

export const AIModelSelectItem: React.FC<IAIModelSelectItem> = ({ model, onClick, testID }) => {
  const aiModelEntitlement = useAIModelEntitlement();
  const upgradeModal = useUpgradeModal();

  const locked = !aiModelEntitlement.isAllowed(model.type);

  if (model.hidden) return null;

  if (locked) {
    return (
      <MenuItemWithTooltip
        label={model.name}
        testID={testID}
        hotKeys={<HotKeys hotKeys={[{ label: model.info }]} />}
        tooltip={{ width: 160, placement: 'right', modifiers: [{ name: 'offset', options: { offset: [16, 5] } }] }}
        disabled
        prefixIconName={model.icon}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>This model can only be used on a paid plan.</Tooltip.Caption>

            <Tooltip.Button
              onClick={() => upgradeModal.openVoid(getAdvancedAiModelUpgradeModal(model.type))}
              testID={tid(testID, 'upgrade')}
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
      testID={testID}
      hotKeys={<HotKeys hotKeys={[{ label: model.info }]} />}
      onClick={onClick}
      disabled={model.disabled}
      prefixIconName={model.icon}
    />
  );
};
