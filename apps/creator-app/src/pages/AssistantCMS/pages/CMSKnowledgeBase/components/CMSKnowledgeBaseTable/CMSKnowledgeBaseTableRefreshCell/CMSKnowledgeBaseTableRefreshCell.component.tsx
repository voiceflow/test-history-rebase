import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Link, Menu, MenuItem, Popper, Text, toast, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { stopPropagation } from '@/utils/handler.util';

import { refreshRateOptions } from '../../../CMSKnowledgeBase.constants';
import { ICMSKnowledgeBaseTableRefreshCell } from './CMSKnowledgeBaseTableRefreshCell.interface';

export const CMSKnowledgeBaseTableRefreshCell: React.FC<ICMSKnowledgeBaseTableRefreshCell> = ({ item }) => {
  const [canSetRefreshRate] = usePermission(Permission.KB_REFRESH_RATE);
  const patchManyRefreshRate = useDispatch(Designer.KnowledgeBase.Document.effect.patchManyRefreshRate);

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

  const onSetRefreshRate = async (refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => {
    await patchManyRefreshRate([item.id], refreshRate);
    toast.success(`Updated`, { delay: 2000, isClosable: false });
  };

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Box width="100%" height="100%" align="center">
          <Link
            ref={ref}
            disabled={!canSetRefreshRate}
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
            <MenuItem key={label} label={label} onClick={stopPropagation(Utils.functional.chainVoid(() => onSetRefreshRate(value), onClose))} />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
