import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { TABLE_TEST_ID } from '../../AssistantCMS.constant';
import { useGetAllNestedResources } from '../../hooks/cms-resource.hook';
import { CMSResourceActionsButton } from './CMSResourceActionsButton/CMSResourceActionsButton.component';

export const CMSResourceActionsButtonExport: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();

  const effects = useAtomValue(cmsManager.effects);
  const exportMany = useDispatch(effects.exportMany ?? (() => () => Promise.resolve()));
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);
  const getAllNestedResources = useGetAllNestedResources();

  const onClick = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const { allResources } = getAllNestedResources(Array.from(selectedIDs));

    await exportMany(allResources.map((resource) => resource.id));

    setSelectedIDs(new Set());
  };

  return <CMSResourceActionsButton label="Export" iconName="Export" onClick={onClick} testID={tid(TABLE_TEST_ID, 'export-selection')} />;
};
