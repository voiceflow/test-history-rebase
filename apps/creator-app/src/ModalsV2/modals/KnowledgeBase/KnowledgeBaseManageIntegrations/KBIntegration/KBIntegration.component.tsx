/* eslint-disable promise/always-return */
import { Utils } from '@voiceflow/common';
import { Box, Divider, DotSeparator, Icon, Menu, MenuItem, notify, Popper, SquareButton, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import dayjs from 'dayjs';
import React from 'react';

import { Designer } from '@/ducks';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { IKBIntegration } from './KBIntegration.interface';
import { formatFromNow } from './KBIntegration.utils';

const { colors } = Tokens;

export const KBIntegration: React.FC<IKBIntegration> = ({ creatorID, icon, platform, date, border, type, onReconnect, onDelete }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  const deleteIntegration = useDispatch(Designer.KnowledgeBase.Integration.effect.deleteOne);

  const fromNow = dayjs(date).fromNow();
  const confirmModal = useConfirmV2Modal();

  const onConfirmRemove = () => {
    deleteIntegration(type)
      .then(() => {
        onDelete();
        notify.short.info(`Integration removed`, { showIcon: false });
      })
      .catch(() => {
        onDelete();
        notify.short.error(`Error removing integration.`, { showIcon: false });
      });
  };

  const onRemove = () => {
    confirmModal.openVoid({
      body: `Removing integrations will not delete data sources previously imported through them. You’ll need to remove data sources from the knowledge base table view.`,
      title: `Remove integration`,
      confirm: onConfirmRemove,
      confirmButtonLabel: 'Delete',
      confirmButtonVariant: 'alert',
    });
  };

  return (
    <>
      {border && <Divider noPadding />}
      <Box pr={16} justify="space-between">
        <Box gap={16} pr={16} justify="center">
          <Box align="center">
            <Icon name={icon} height={36} width={36} />
          </Box>
          <Box direction="column" justify="center">
            <Text weight="semiBold" color={colors.neutralDark.neutralsDark900}>
              {platform}
            </Text>
            <Box>
              <Text variant="caption" color={colors.neutralDark.neutralsDark100}>
                {`Connected ${formatFromNow(fromNow)}`}
              </Text>
              <DotSeparator light px={8} />
              <Tooltip.Overflow
                referenceElement={({ ref, onOpen, onClose }) => (
                  <Text ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} overflow variant="caption" color={colors.neutralDark.neutralsDark100}>
                    {member?.name || 'Unknown'}
                  </Text>
                )}
              >
                {() => (
                  <Text variant="caption" breakWord>
                    {member?.name || 'Unknown'}
                  </Text>
                )}
              </Tooltip.Overflow>
            </Box>
          </Box>
        </Box>
        <Popper
          placement="bottom-start"
          referenceElement={({ ref, popper, isOpen, onOpen }) => (
            <SquareButton ref={ref} isActive={isOpen} onClick={() => onOpen()} iconName="More">
              {popper}
            </SquareButton>
          )}
        >
          {({ onClose, referenceRef }) => (
            <Menu minWidth={referenceRef.current?.clientWidth}>
              <MenuItem label="Reconnect" prefixIconName="Sync" onClick={() => onReconnect()} />
              <Divider />
              <MenuItem label="Remove" prefixIconName="Trash" onClick={Utils.functional.chainVoid(onClose, onRemove)} />
            </Menu>
          )}
        </Popper>
      </Box>
    </>
  );
};
