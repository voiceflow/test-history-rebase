import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Link, Menu, MenuItem, notify, Popper, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { UpgradeTooltipPlanPermission } from '@/config/planPermission';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { useStore } from '@/hooks/redux';
import { stopPropagation } from '@/utils/handler.util';

import { refreshRateOptions } from '../../../CMSKnowledgeBase.constants';
import { captionStyles } from './CMSKnowledgeBaseTableRefreshCell.css';
import type { ICMSKnowledgeBaseTableRefreshCell } from './CMSKnowledgeBaseTableRefreshCell.interface';

export const CMSKnowledgeBaseTableRefreshCell: React.FC<ICMSKnowledgeBaseTableRefreshCell> = ({ item }) => {
  const refreshRatePermission = usePermission(Permission.KB_REFRESH_RATE);
  const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);
  const store = useStore();
  const patchManyRefreshRate = useDispatch(Designer.KnowledgeBase.Document.effect.patchManyRefreshRate);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);

  const hasNeededIntegrations = React.useMemo(
    () =>
      item?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL && item.data.source
        ? integrations.find(
            (integration) => integration.type === (item.data as BaseModels.Project.KnowledgeBaseURL)?.source
          )
        : true,
    [integrations, item]
  );

  if (item.data?.type !== BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    return (
      <Box>
        <Text color={Tokens.colors.neutralDark.neutralsDark50}>—</Text>
      </Box>
    );
  }

  const onRefreshRateClick = (onOpen: VoidFunction) => {
    if (refreshRatePermission.allowed) onOpen();
  };

  const onSetRefreshRate = async (refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => {
    await patchManyRefreshRate([item.id], refreshRate);
    notify.short.success('Updated', { delay: 2000, isClosable: false });
  };

  const upgradeTooltip =
    !refreshRatePermission.planAllowed &&
    refreshRatePermission.planConfig &&
    (refreshRatePermission.planConfig as UpgradeTooltipPlanPermission<any>).upgradeTooltip({});

  if (upgradeTooltip) {
    return (
      <Box onMouseLeave={() => setIsUpgradeModalOpen(false)} width="100%">
        <Tooltip
          placement="bottom"
          isOpen={isUpgradeModalOpen}
          onOpen={() => setIsUpgradeModalOpen(true)}
          referenceElement={({ ref, onOpen }) => (
            <Box width="100%" height="100%" align="center">
              <Link
                ref={ref}
                disabled
                size="medium"
                weight="regular"
                onMouseEnter={onOpen}
                onClick={stopPropagation(() => {})}
                label={(item.data as BaseModels.Project.KnowledgeBaseURL).refreshRate || 'Never'}
                style={{ textTransform: 'capitalize' }}
              />
            </Box>
          )}
        >
          {() => (
            <Box direction="column">
              <Tooltip.Caption>{upgradeTooltip.description}</Tooltip.Caption>
              {upgradeTooltip.upgradeButtonText && (
                <Tooltip.Button onClick={() => upgradeTooltip.onUpgrade(store.dispatch)}>
                  {upgradeTooltip.title}
                </Tooltip.Button>
              )}
            </Box>
          )}
        </Tooltip>
      </Box>
    );
  }

  if (!hasNeededIntegrations) {
    return (
      <Box width="100%">
        <Tooltip
          placement="bottom"
          referenceElement={({ ref, onOpen, onClose }) => (
            <Box width="100%" height="100%" align="center">
              <Link
                ref={ref}
                disabled
                size="medium"
                weight="regular"
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                onClick={stopPropagation(() => {})}
                label={(item.data as BaseModels.Project.KnowledgeBaseURL).refreshRate || 'Never'}
                style={{ textTransform: 'capitalize' }}
              />
            </Box>
          )}
        >
          {() => (
            <Box direction="column">
              <Tooltip.Caption className={captionStyles}>Integration removed</Tooltip.Caption>
            </Box>
          )}
        </Tooltip>
      </Box>
    );
  }

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Box width="100%" height="100%" align="center">
          <Link
            ref={ref}
            isActive={isOpen}
            onClick={stopPropagation(() => onRefreshRateClick(onOpen))}
            size="medium"
            weight="regular"
            label={(item.data as BaseModels.Project.KnowledgeBaseURL).refreshRate || 'Never'}
            style={{ textTransform: 'capitalize' }}
          >
            {popper}
          </Link>
        </Box>
      )}
    >
      {({ onClose }) => (
        <Menu minWidth={0}>
          {refreshRateOptions.map(({ label, value }) => (
            <MenuItem
              key={label}
              label={label}
              onClick={stopPropagation(Utils.functional.chainVoid(() => onSetRefreshRate(value), onClose))}
            />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
