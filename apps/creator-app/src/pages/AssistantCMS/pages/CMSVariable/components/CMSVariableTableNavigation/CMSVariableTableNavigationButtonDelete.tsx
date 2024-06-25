import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import { isSystemVariableName } from '@voiceflow/utils-designer';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { CMSResourceActionsButton } from '@/pages/AssistantCMS/components/CMSResourceActions/CMSResourceActionsButton/CMSResourceActionsButton.component';
import { useCMSResourceOnDeleteMany } from '@/pages/AssistantCMS/hooks/cms-resource.hook';

export const CMSVariableTableNavigationButtonDelete: React.FC = () => {
  const tableState = Table.useStateMolecule();
  const selectedIDs = useAtomValue(tableState.selectedIDs);

  const selectedIDsArray = useMemo(() => Array.from(selectedIDs), [selectedIDs]);
  const allSelectedAreBuiltIns = useMemo(() => selectedIDsArray.every(isSystemVariableName), [selectedIDsArray]);

  const onDeleteMany = useCMSResourceOnDeleteMany();

  const onClick = () => onDeleteMany(selectedIDsArray.filter((id) => !isSystemVariableName(id)));

  if (allSelectedAreBuiltIns) {
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
        {() => <Text variant="caption">Built-in variables can’t be deleted</Text>}
      </Tooltip>
    );
  }

  return <CMSResourceActionsButton label="Delete" iconName="Trash" onClick={onClick} />;
};
