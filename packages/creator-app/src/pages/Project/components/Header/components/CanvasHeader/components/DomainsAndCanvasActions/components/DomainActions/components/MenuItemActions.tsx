import { BaseModels } from '@voiceflow/base-types';
import { Box, Divider, Menu as UIMenu, Toggle } from '@voiceflow/ui';
import React from 'react';

import Domains from '@/components/Domains';

import MenuItemStatusActionItem from './MenuItemStatusActionItem';

export interface MenuItemActionsProps {
  live: boolean;
  onEdit: VoidFunction;
  status?: BaseModels.Version.DomainStatus;
  isRoot?: boolean;
  onDelete: VoidFunction;
  onDuplicate: VoidFunction;
  onToggleLive: (live: boolean) => void;
  onChangeStatus: (status: BaseModels.Version.DomainStatus) => void;
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({ live, isRoot, onEdit, status, onDelete, onDuplicate, onToggleLive, onChangeStatus }) => (
  <UIMenu width={177} noBottomPadding>
    <UIMenu.Item onClick={() => onEdit()}>Rename</UIMenu.Item>
    <UIMenu.Item onClick={() => onDuplicate()}>Duplicate</UIMenu.Item>

    <Divider offset={8} isSecondaryColor />

    <MenuItemStatusActionItem status={status} onChange={onChangeStatus} />

    {!isRoot && (
      <>
        <Divider offset={8} isSecondaryColor />

        <UIMenu.Item onClick={() => onDelete()}>Delete</UIMenu.Item>
      </>
    )}

    <Divider offset={[8, 0]} isSecondaryColor />

    <Domains.LiveToggleTooltip live={live} distance={0} position="right-start">
      <UIMenu.Item ending onClick={() => onToggleLive(!live)} disabled={isRoot}>
        <Box mr="auto">{live ? 'Is live' : 'Is draft'}</Box>

        <Toggle size={Toggle.Size.EXTRA_SMALL} checked={live} disabled={isRoot} />
      </UIMenu.Item>
    </Domains.LiveToggleTooltip>
  </UIMenu>
);

export default MenuItemActions;
