import { Utils } from '@voiceflow/common';
import { Button, Menu, Popper, Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

export const CMSKnowledgeBaseTableNavigationRefreshRateButton: React.FC<{ canSetRefreshRate?: boolean }> = (canSetRefreshRate) => {
  const tableState = Table.useStateMolecule();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const onSetRefreshRate = () => () => {
    setSelectedIDs(new Set());
    toast.success(`Updated`, { delay: 2000, isClosable: false });
  };

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onToggle }) => (
        <Button
          ref={ref}
          size="medium"
          label="Refresh rate"
          onClick={onToggle}
          variant="secondary"
          iconName="Timer"
          isActive={isOpen}
          disabled={!canSetRefreshRate}
        >
          {popper}
        </Button>
      )}
    >
      {({ onClose }) => (
        <Menu width={140}>
          <Menu.Item label="Never" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
          <Menu.Item label="Daily" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
          <Menu.Item label="Weekly" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
          <Menu.Item label="Monthly" onClick={Utils.functional.chainVoid(onSetRefreshRate, onClose)} />
        </Menu>
      )}
    </Popper>
  );
};
