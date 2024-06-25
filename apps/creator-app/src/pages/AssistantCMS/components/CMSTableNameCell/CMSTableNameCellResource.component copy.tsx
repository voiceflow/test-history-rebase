import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { useDispatch } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSTableHighlightedTooltip } from '../CMSTableHighlightedTooltip/CMSTableHighlightedTooltip.component';
import type { ICMSTableNameCell } from './CMSTableNameCell.interface';

export const CMSTableNameCellResource = <ColumnType extends string>({
  type,
  name,
  itemID,
  nameTransform,
}: ICMSTableNameCell<ColumnType>) => {
  const cmsManager = useCMSManager();

  const search = useAtomValue(cmsManager.search);
  const effects = useAtomValue(cmsManager.effects);

  const patchOne = useDispatch(effects.patchOne, itemID);

  const onRename = (name: string) => {
    if (!name.trim()) return;

    patchOne({ name: name.trim() });
  };

  return (
    <Table.Cell.Editable type={type} id={itemID} label={name} onRename={onRename} labelTransform={nameTransform}>
      <CMSTableHighlightedTooltip label={name} search={search} />
    </Table.Cell.Editable>
  );
};
