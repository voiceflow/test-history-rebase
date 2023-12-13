import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { useDispatch } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSResourceActionsButton } from '../CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonExport: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const cmsManager = useCMSManager();

  const { exportMany } = useAtomValue(cmsManager.effects);
  const dispatchExportMany = useDispatch(exportMany || (() => () => Promise.resolve()));

  const onClick = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);

    await dispatchExportMany(Array.from(selectedIDs));
  };

  return <CMSResourceActionsButton label="Export" iconName="Export" onClick={onClick} />;
};
