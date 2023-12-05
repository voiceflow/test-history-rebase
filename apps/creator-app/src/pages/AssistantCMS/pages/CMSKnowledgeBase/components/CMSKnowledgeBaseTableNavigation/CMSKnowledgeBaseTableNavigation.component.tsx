import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

import { useFeature } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import * as ModalsV2 from '@/ModalsV2';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

import { CMSKnowledgeBaseTableNavigationMoreButton } from './CMSKnowledgeBaseTableNavigationMoreButton.component';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const { state, actions } = React.useContext(CMSKnowledgeBaseContext);
  const deleteModal = ModalsV2.useModal(ModalsV2.KnowledgeBase.Delete);
  const count = state.documents.length;
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onDelete = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const numSelected = selectedIDs.size;

    const isSuccess = await Promise.all(Array.from(selectedIDs).map((id) => actions.remove(id)));
    setSelectedIDs(new Set());

    if (!isSuccess) {
      toast.error('Something went wrong. Please try again later.', { isClosable: false });
      return;
    }

    toast.info(`${numSelected} data sources deleted`, { showIcon: false, isClosable: false });
  };

  const onClickDelete = () => {
    deleteModal.openVoid({
      onDelete,
      numDocuments: getAtomValue(tableState.selectedIDs).size,
    });
  };

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          <Button label="Delete" iconName="Trash" size="medium" variant="secondary" onClick={onClickDelete} />
          {isRefreshEnabled && <CMSKnowledgeBaseTableNavigationMoreButton />}
        </>
      }
    />
  );
};
