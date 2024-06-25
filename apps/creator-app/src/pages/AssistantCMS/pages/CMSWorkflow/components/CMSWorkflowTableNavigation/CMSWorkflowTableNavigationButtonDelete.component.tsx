import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CMSResourceActionsButton } from '@/pages/AssistantCMS/components/CMSResourceActions/CMSResourceActionsButton/CMSResourceActionsButton.component';
import { useCMSResourceOnDeleteMany } from '@/pages/AssistantCMS/hooks/cms-resource.hook';

export const CMSWorkflowTableNavigationButtonDelete: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const selectedIDs = useAtomValue(tableState.selectedIDs);

  const getOneByID = useSelector(Designer.Workflow.selectors.getOneByID);

  const selectedIDsArray = useMemo(() => Array.from(selectedIDs), [selectedIDs]);
  const isStartOnlySelected = useMemo(
    () => selectedIDsArray.length === 1 && getOneByID({ id: selectedIDsArray[0] })?.isStart,
    [selectedIDsArray, getOneByID]
  );

  const onDeleteMany = useCMSResourceOnDeleteMany();

  const onClick = () => onDeleteMany(selectedIDsArray.filter((id) => !getOneByID({ id })?.isStart));

  if (isStartOnlySelected) {
    return (
      <Tooltip
        placement="bottom"
        referenceElement={({ ref, onOpen, onClose }) => (
          <CMSResourceActionsButton
            ref={ref}
            label="Delete"
            iconName="Trash"
            disabled
            onPointerEnter={onOpen}
            onPointerLeave={onClose}
          />
        )}
      >
        {() => <Text variant="caption">Default workflow can’t be deleted</Text>}
      </Tooltip>
    );
  }

  return <CMSResourceActionsButton label="Delete" iconName="Trash" onClick={onClick} />;
};
