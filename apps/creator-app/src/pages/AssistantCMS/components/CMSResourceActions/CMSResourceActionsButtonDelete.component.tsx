import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { useCMSResourceOnDeleteMany } from '../../hooks/cms-resource.hook';
import { CMSResourceActionsButton } from './CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonDelete: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const onDeleteMany = useCMSResourceOnDeleteMany();

  const onClick = () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);

    onDeleteMany(Array.from(selectedIDs));
  };

  return <CMSResourceActionsButton label="Delete" iconName="Trash" onClick={onClick} testID={tid(TABLE_TEST_ID, 'delete-selection')} />;
};
