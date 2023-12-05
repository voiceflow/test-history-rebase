import { Utils } from '@voiceflow/common';
import { Button, Menu, MenuItem, Popper, Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { CMSKnowledgeBaseTableNavigationRefreshRate } from './CMSKnowledgeBaseTableNavigationRefreshRate.component';

export const CMSKnowledgeBaseTableNavigationMoreButton: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const { actions } = React.useContext(CMSKnowledgeBaseContext);
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onSetRefreshRate = (rate: string) => () => {
    toast.success(`Refresh rate updated to ${rate}`, { delay: 2000, isClosable: false });
  };

  const onResync = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    try {
      toast.info('Syncing data sources', { isClosable: false });
      setSelectedIDs(new Set());
      await actions.resync(Array.from(selectedIDs));
      toast.success('Data source synced', { isClosable: false });
    } catch {
      toast.error('Failed to sync data source', { isClosable: false });
    }
  };

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onOpen }) => (
        <Button ref={ref} iconName="More" size="medium" variant="secondary" isActive={isOpen} onClick={() => onOpen()}>
          {popper}
        </Button>
      )}
    >
      {({ onClose }) => (
        <Menu width={140}>
          <MenuItem label="Re-sync" onClick={Utils.functional.chainVoidAsync(onResync, onClose)} />
          <CMSKnowledgeBaseTableNavigationRefreshRate onClose={onClose} onSetRefreshRate={onSetRefreshRate} />
        </Menu>
      )}
    </Popper>
  );
};
