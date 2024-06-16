import { Utils } from '@voiceflow/common';
import {
  Box,
  Divider,
  DotSeparator,
  Icon,
  Menu,
  MenuItem,
  notify,
  Popper,
  SquareButton,
  Text,
  Tokens,
  Tooltip,
} from '@voiceflow/ui-next';
import dayjs from 'dayjs';
import React from 'react';

import { Designer } from '@/ducks';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { IKBIntegration } from './KBIntegration.interface';
import { formatFromNow } from './KBIntegration.utils';

const { colors } = Tokens;

export const KBIntegration: React.FC<IKBIntegration> = ({
  type,
  date,
  icon,
  border,
  platform,
  disabled,
  onRemoved,
  creatorID,
  onReconnect,
  enableClose,
  preventClose,
}) => {
  const member = useSelector(WorkspaceV2.active.members.memberByIDSelector, { creatorID });

  const deleteIntegration = useDispatch(Designer.KnowledgeBase.Integration.effect.deleteOne);

  const fromNow = dayjs(date).fromNow();
  const confirmModal = useConfirmV2Modal();

  const onConfirmRemove = async () => {
    preventClose();

    try {
      await deleteIntegration(type);

      enableClose();
      onRemoved();
      notify.short.info('Integration removed', { showIcon: false });
    } catch {
      notify.short.error('Error removing integration', { showIcon: false });
    }

    enableClose();
  };

  const onRemove = () => {
    confirmModal.openVoid({
      body: 'Removing integrations will not delete data sources previously imported through them. You’ll need to remove data sources from the knowledge base table view.',
      title: 'Remove integration',
      confirm: onConfirmRemove,
      confirmButtonLabel: 'Remove',
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
          <Box direction="column" justify="center" pt={3}>
            <Text weight="semiBold" color={colors.neutralDark.neutralsDark900}>
              {platform}
            </Text>
            <Box>
              <Tooltip.Overflow
                referenceElement={({ ref, onOpen, onClose }) => (
                  <Box maxWidth={252}>
                    <Box style={{ flexShrink: 0 }}>
                      <Text variant="caption" color={colors.neutralDark.neutralsDark100}>
                        {`Connected ${formatFromNow(fromNow)}`}
                      </Text>
                    </Box>
                    <DotSeparator light px={8} />
                    <Text
                      ref={ref}
                      onMouseEnter={onOpen}
                      onMouseLeave={onClose}
                      variant="caption"
                      color={colors.neutralDark.neutralsDark100}
                      overflow
                    >
                      {member?.name || 'Unknown'}
                    </Text>
                  </Box>
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
            <SquareButton ref={ref} isActive={isOpen} onClick={() => onOpen()} iconName="More" disabled={disabled}>
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
