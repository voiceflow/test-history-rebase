import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Menu, MenuItem, Popper, Table, toast } from '@voiceflow/ui-next';
import { useAtom, useSetAtom } from 'jotai';
import React from 'react';

import { useFeature } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import * as ModalsV2 from '@/ModalsV2';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const [activeID, setActiveID] = useAtom(tableState.activeID);
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const { state, actions } = React.useContext(CMSKnowledgeBaseContext);
  const deleteModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Delete);
  const count = state.documents.length;
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onDelete = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const numSelected = selectedIDs.size;

    if (activeID && selectedIDs.has(activeID)) setActiveID(null);
    const isSuccess = await Promise.all(Array.from(selectedIDs).map((id) => actions.remove(id)));
    setSelectedIDs(new Set());

    if (!isSuccess) {
      toast.error('Something went wrong. Please try again later.');
      return;
    }

    toast.info(`${numSelected} data sources deleted`, { showIcon: false });
  };

  const onClickDelete = () => {
    deleteModal.openVoid({
      onDelete,
      numDocuments: getAtomValue(tableState.selectedIDs).size,
    });
  };

  const onSetRefreshRate = () => () => {
    setSelectedIDs(new Set());
    toast.success(`Updated`, { delay: 2000, isClosable: false });
  };

  const onResync = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    try {
      toast.info('Syncing', { isClosable: false });
      setSelectedIDs(new Set());
      await actions.resync(Array.from(selectedIDs));
      toast.success('Synced', { isClosable: false });
    } catch {
      toast.error('Failed to sync data source', { isClosable: false });
    }
  };

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          {isRefreshEnabled && (
            <>
              <Button label="Re-sync" iconName="Sync" size="medium" variant="secondary" onClick={onResync} />
              <Popper
                placement="bottom-start"
                referenceElement={({ ref, popper, isOpen, onOpen }) => (
                  <Button
                    ref={ref}
                    label="Refresh rate"
                    iconName="Timer"
                    size="medium"
                    variant="secondary"
                    isActive={isOpen}
                    onClick={() => onOpen()}
                  >
                    {popper}
                  </Button>
                )}
              >
                {({ onClose }) => (
                  <Menu width={140}>
                    <MenuItem label="Never" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
                    <MenuItem label="Daily" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
                    <MenuItem label="Weekly" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
                    <MenuItem label="Monthly" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
                  </Menu>
                )}
              </Popper>
            </>
          )}
          <Button label="Delete" iconName="Trash" size="medium" variant="secondary" onClick={onClickDelete} />
        </>
      }
    />
  );
};
