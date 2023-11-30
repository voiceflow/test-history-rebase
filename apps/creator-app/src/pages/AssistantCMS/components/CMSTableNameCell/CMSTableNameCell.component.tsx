import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { useDispatch } from '@/hooks/store.hook';
import { CMSManagerConsumer, useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';

import { CMSTableHighlightedTooltip } from '../CMSTableHighlightedTooltip/CMSTableHighlightedTooltip.component';
import type { ICMSTableNameCell } from './CMSTableNameCell.interface';

export const CMSTableNameCell = <ColumnType extends string>({ type, label, itemID }: ICMSTableNameCell<ColumnType>) => {
  const cmsManager = useCMSManager();
  const effects = useAtomValue(cmsManager.effects);
  const updateResource = useDispatch(effects.patchOne, itemID);

  const onRename = (name: string) => updateResource({ name });

  return (
    <CMSManagerConsumer
      field="search"
      render={(search) => (
        <Table.Cell.Editable type={type} id={itemID} label={label} onRename={onRename}>
          <CMSTableHighlightedTooltip label={label} search={search} />
        </Table.Cell.Editable>
      )}
    />
  );
};
