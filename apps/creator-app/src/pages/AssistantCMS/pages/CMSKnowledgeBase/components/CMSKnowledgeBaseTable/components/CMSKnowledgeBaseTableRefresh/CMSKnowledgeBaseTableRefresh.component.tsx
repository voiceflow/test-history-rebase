import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, Menu, MenuItem, Popper, Text, toast } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks';
import { KnowledgeBaseTableItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { stopPropagation } from '@/utils/handler.util';

import { disabledTextStyle } from './CMSKnowledgeBaseTableRefresh.css';

export const DocumentRefresh: React.FC<{ item: KnowledgeBaseTableItem }> = ({ item }) => {
  const [refreshRate, setRefreshRate] = React.useState<string>('Never');
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);

  const onSetRefreshRate = (rate: string) => () => {
    setRefreshRate(rate);
    toast.success('Updated', { isClosable: false });
  };

  if (!isRefreshEnabled || item.data.type !== BaseModels.Project.KnowledgeBaseDocumentType.URL) {
    return (
      <Box>
        <Text className={disabledTextStyle}>—</Text>
      </Box>
    );
  }
  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Box width="100%" height="100%" align="center">
          <Link ref={ref} size="medium" weight="regular" label={refreshRate} isActive={isOpen} onClick={stopPropagation(onOpen)}>
            {popper}
          </Link>
        </Box>
      )}
    >
      {({ referenceRef, onClose }) => (
        <Menu width={`max(100%, ${referenceRef.current?.clientWidth ?? 0}px)`}>
          <MenuItem key="Never" label="Never" onClick={stopPropagation(Utils.functional.chainVoid(onSetRefreshRate('Never'), onClose))} />
          <MenuItem key="Daily" label="Daily" onClick={stopPropagation(Utils.functional.chainVoid(onSetRefreshRate('Daily'), onClose))} />
          <MenuItem key="Weekly" label="Weekly" onClick={stopPropagation(Utils.functional.chainVoid(onSetRefreshRate('Weekly'), onClose))} />
          <MenuItem key="Monthly" label="Monthly" onClick={stopPropagation(Utils.functional.chainVoid(onSetRefreshRate('Monthly'), onClose))} />
        </Menu>
      )}
    </Popper>
  );
};
