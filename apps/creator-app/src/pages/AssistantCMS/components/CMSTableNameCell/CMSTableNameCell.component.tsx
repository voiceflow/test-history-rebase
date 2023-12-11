import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { useDispatch } from '@/hooks/store.hook';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { transformCMSResourceName } from '@/utils/cms.util';

import { CMSTableHighlightedTooltip } from '../CMSTableHighlightedTooltip/CMSTableHighlightedTooltip.component';
import type { ICMSTableNameCell } from './CMSTableNameCell.interface';

export const CMSTableNameCell = <ColumnType extends string>({
  type,
  name,
  itemID,
  nameTransform = transformCMSResourceName,
}: ICMSTableNameCell<ColumnType>) => {
  const cmsManager = useCMSManager();
  const search = useAtomValue(cmsManager.search);
  const effects = useAtomValue(cmsManager.effects);
  const updateResource = useDispatch(effects.patchOne, itemID);

  const onRename = (name: string) => {
    if (!name.trim()) return;

    updateResource({ name: name.trim() });
  };

  return (
    <Table.Cell.Editable type={type} id={itemID} label={name} onRename={onRename} labelTransform={nameTransform}>
      <CMSTableHighlightedTooltip label={name} search={search} />
    </Table.Cell.Editable>
  );
};
