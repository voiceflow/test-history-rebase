import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Button, Menu, Popper, Table, toast, Tooltip } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
import React from 'react';

import type { UpgradeTooltipData } from '@/components/UpgradeTooltip';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useStore } from '@/hooks/redux';

import { refreshRateOptions } from '../../CMSKnowledgeBase.constants';

export const CMSKnowledgeBaseTableNavigationRefreshRateButton: React.FC<{
  upgradeTooltip: false | null | UpgradeTooltipData;
}> = ({ upgradeTooltip }) => {
  const tableState = Table.useStateMolecule();
  const store = useStore();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);
  const getAtomValue = useGetAtomValue();
  const patchManyRefreshRate = useDispatch(Designer.KnowledgeBase.Document.effect.patchManyRefreshRate);

  const onSetRefreshRate = async (refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    setSelectedIDs(new Set());
    await patchManyRefreshRate(Array.from(selectedIDs), refreshRate);
    toast.success(`Updated`, { delay: 2000, isClosable: false });
  };

  if (upgradeTooltip) {
    return (
      <Tooltip
        placement="right"
        referenceElement={({ ref, onOpen, onClose, isOpen }) => (
          <Box ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
            <Button size="medium" label="Refresh rate" variant="secondary" iconName="Timer" isActive={isOpen} disabled />
          </Box>
        )}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>{upgradeTooltip.description}</Tooltip.Caption>
            {upgradeTooltip.upgradeButtonText && (
              <Tooltip.Button onClick={() => upgradeTooltip.onUpgrade(store.dispatch)}>{upgradeTooltip.title}</Tooltip.Button>
            )}
          </Box>
        )}
      </Tooltip>
    );
  }

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ ref, popper, isOpen, onToggle }) => (
        <Button ref={ref} size="medium" label="Refresh rate" onClick={onToggle} variant="secondary" iconName="Timer" isActive={isOpen}>
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
