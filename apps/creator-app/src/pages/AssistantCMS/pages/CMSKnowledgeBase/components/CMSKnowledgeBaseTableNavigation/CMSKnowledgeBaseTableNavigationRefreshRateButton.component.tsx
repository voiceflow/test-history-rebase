import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Button, Menu, Popper, Table, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';

import { refreshRateOptions } from '../../CMSKnowledgeBase.constants';

export const CMSKnowledgeBaseTableNavigationRefreshRateButton: React.FC<{ canSetRefreshRate?: boolean }> = (canSetRefreshRate) => {
  const tableState = Table.useStateMolecule();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);
  const getAtomValue = useGetAtomValue();
  const patchManyRefreshRate = useDispatch(Designer.KnowledgeBase.Document.effect.patchManyRefreshRate);

  const onSetRefreshRate = async (refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    setSelectedIDs(new Set());
    await patchManyRefreshRate(Array.from(selectedIDs), refreshRate);
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
      {({ onClose, referenceRef }) => (
        <Menu minWidth={referenceRef.current?.clientWidth}>
          {refreshRateOptions.map(({ label, value }) => (
            <Menu.Item label={label} key={label} onClick={Utils.functional.chainVoid(() => onSetRefreshRate(value), onClose)} />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
