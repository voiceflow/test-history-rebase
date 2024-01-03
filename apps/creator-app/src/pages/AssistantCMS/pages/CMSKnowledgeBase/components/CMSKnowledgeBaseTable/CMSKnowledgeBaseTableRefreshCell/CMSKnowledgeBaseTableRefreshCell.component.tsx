import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Link, Menu, MenuItem, Popper, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { stopPropagation } from '@/utils/handler.util';

import { ICMSKnowledgeBaseTableRefreshCell } from './CMSKnowledgeBaseTableRefreshCell.interface';

export const CMSKnowledgeBaseTableRefreshCell: React.FC<ICMSKnowledgeBaseTableRefreshCell> = ({ item }) => {
  const [canSetRefreshRate] = usePermission(Permission.KB_REFRESH_RATE);

  if (item.data?.type !== BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    return (
      <Box>
        <Text color={Tokens.colors.neutralDark.neutralsDark50}>—</Text>
      </Box>
    );
  }

  const onRefreshRateClick = (onOpen: VoidFunction) => {
    if (canSetRefreshRate) onOpen();
  };

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Box width="100%" height="100%" align="center">
          <Link
            ref={ref}
            disabled={!canSetRefreshRate}
            size="medium"
            weight="regular"
            label="Never"
            isActive={isOpen}
            onClick={stopPropagation(() => onRefreshRateClick(onOpen))}
          >
            {popper}
          </Link>
        </Box>
      )}
    >
      {({ onClose }) => (
        <Menu minWidth={0}>
          <MenuItem key="Never" label="Never" onClick={stopPropagation(Utils.functional.chainVoid(onClose))} />
          <MenuItem key="Daily" label="Daily" onClick={stopPropagation(Utils.functional.chainVoid(onClose))} />
          <MenuItem key="Weekly" label="Weekly" onClick={stopPropagation(Utils.functional.chainVoid(onClose))} />
          <MenuItem key="Monthly" label="Monthly" onClick={stopPropagation(Utils.functional.chainVoid(onClose))} />
        </Menu>
      )}
    </Popper>
  );
};
