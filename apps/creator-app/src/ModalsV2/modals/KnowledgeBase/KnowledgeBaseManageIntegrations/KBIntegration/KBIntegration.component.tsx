import { Utils } from '@voiceflow/common';
import { Box, Divider, DotSeparator, Icon, Menu, MenuItem, Popper, SquareButton, Text, toast, Tokens } from '@voiceflow/ui-next';
import dayjs from 'dayjs';
import React from 'react';

import { useConfirmV2Modal } from '@/hooks/modal.hook';

import { IKBIntegration } from './KBIntegration.interface';
import { formatFromNow } from './KBIntegration.utils';

const { colors } = Tokens;

export const KBIntegration: React.FC<IKBIntegration> = ({ name, icon, platform, date, border, onReconnect }) => {
  const fromNow = dayjs(date).fromNow();
  const confirmModal = useConfirmV2Modal();

  const onConfirmRemove = () => {
    toast.info(`Integration removed`, { showIcon: false });
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
        <Box gap={16} pr={16}>
          <Box align="center">
            <Icon name={icon} height={36} width={36} />
          </Box>
          <Box direction="column">
            <Text weight="semiBold">{platform}</Text>
            <Box>
              <Text variant="caption" color={colors.neutralDark.neutralsDark100}>
                {`Connected ${formatFromNow(fromNow)}`}
              </Text>
              <DotSeparator light px={8} />
              <Text variant="caption" color={colors.neutralDark.neutralsDark100}>
                {name}
              </Text>
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
              <MenuItem label="Remove" prefixIconName="Trash" onClick={Utils.functional.chainVoid(onClose, onRemove)} />
            </Menu>
          )}
        </Popper>
      </Box>
    </>
  );
};
