import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Dropdown, Menu, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { UpgradeTooltipPlanPermission } from '@/config/planPermission';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { useStore } from '@/hooks/redux';

import { IRefreshRateSelect } from './RefreshRateSelect.interface';

export const KBRefreshRateSelect: React.FC<IRefreshRateSelect> = ({
  value = BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER,
  onValueChange,
  disabled,
}) => {
  const store = useStore();
  const refreshRatePermission = usePermission(Permission.KB_REFRESH_RATE);

  const rateOrder = [
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.DAILY,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.WEEKLY,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.MONTHLY,
  ];

  const upgradeTooltip =
    !refreshRatePermission.planAllowed &&
    refreshRatePermission.planConfig &&
    (refreshRatePermission.planConfig as UpgradeTooltipPlanPermission<any>).upgradeTooltip({});

  const dropdown = ({ ref, onOpen, onClose }: { ref?: React.Ref<any>; onOpen?: VoidFunction; onClose?: VoidFunction }) => (
    <>
      <Box ref={ref} grow={1} direction="column" onMouseEnter={onOpen} onMouseLeave={onClose}>
        <Dropdown value={Utils.string.capitalizeFirstLetter(value)} label="Refresh rate" disabled={disabled || !refreshRatePermission.allowed}>
          {({ onClose }) => (
            <Menu>
              {rateOrder.map((rate) => (
                <Menu.Item
                  key={rate}
                  label={Utils.string.capitalizeFirstLetter(rate)}
                  onClick={Utils.functional.chainVoid(onClose, () => onValueChange(rate))}
                />
              ))}
            </Menu>
          )}
        </Dropdown>

        <Box mt={6}>
          <Text color={Tokens.colors.neutralDark.neutralsDark50} variant="fieldCaption">
            How often will the data source sync.
          </Text>
        </Box>
      </Box>
    </>
  );

  return upgradeTooltip ? (
    <Tooltip placement="right" referenceElement={({ ref, onOpen, onClose }) => dropdown({ ref, onOpen, onClose })}>
      {() => (
        <Box direction="column">
          <Tooltip.Caption>{upgradeTooltip.description}</Tooltip.Caption>
          {upgradeTooltip.upgradeButtonText && (
            <Tooltip.Button onClick={() => upgradeTooltip.onUpgrade(store.dispatch)}>{upgradeTooltip.upgradeButtonText}</Tooltip.Button>
          )}
        </Box>
      )}
    </Tooltip>
  ) : (
    dropdown({})
  );
};
