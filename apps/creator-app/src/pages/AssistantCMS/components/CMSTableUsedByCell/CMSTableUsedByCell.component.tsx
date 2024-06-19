import { Menu, useConst } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import { memoize } from 'lodash';
import React, { useMemo } from 'react';

import { refererIDsByResourceIDMapAtom } from '@/atoms/reference.atom';

import { CMSTableLinkMenuCell } from '../CMSTableLinkMenuCell/CMSTableLinkMenuCell.component';
import { useCMStableUsedByCellGetItem } from './CMSTableUsedByCell.hook';
import { CMSTableUsedByCellItem, ICMSTableUsedByCell } from './CMSTableUsedByCell.interface';
import { CMSTableUsedByCellItemType } from './CMSTableUsedByCellItemType.enum';

export const CMSTableUsedByCell: React.FC<ICMSTableUsedByCell> = ({
  getItem,
  resourceID,
  referenceResourceIDByResourceIDMap,
}) => {
  const refererIDsByResourceIDMap = useAtomValue(refererIDsByResourceIDMapAtom);

  const defaultRefererIDs = useConst([]);
  const referenceResourceID = resourceID ? referenceResourceIDByResourceIDMap[resourceID] : null;
  const refererIDs = referenceResourceID
    ? refererIDsByResourceIDMap[referenceResourceID] ?? defaultRefererIDs
    : defaultRefererIDs;
  const firstRefererID = refererIDs[0];

  const defaultGetReferrerItem = useCMStableUsedByCellGetItem();
  const getReferrerItem = getItem ?? defaultGetReferrerItem;

  const getContentMemoized = useMemo(
    () =>
      memoize((items: string[], getRefItem: typeof getReferrerItem) => {
        const itemMap: Record<string, CMSTableUsedByCellItem> = {};
        const flowIDs: string[] = [];
        const intentIDs: string[] = [];
        const workflowIDs: string[] = [];

        for (const id of items) {
          const item = getRefItem(id);

          if (!item) continue;

          switch (item.type) {
            case CMSTableUsedByCellItemType.FLOW:
              flowIDs.push(id);
              break;
            case CMSTableUsedByCellItemType.INTENT:
              intentIDs.push(id);
              break;
            case CMSTableUsedByCellItemType.WORKFLOW:
              workflowIDs.push(id);
              break;
            default:
              break;
          }

          itemMap[item.id] = item;
        }

        const result: React.ReactNode[] = [];

        if (workflowIDs.length) {
          result.push(<Menu.Divider key="workflow-divider" label="Workflows" fullWidth={false} />);

          result.push(
            ...workflowIDs.map((id) => {
              const item = itemMap[id];

              return <Menu.Item key={id} label={item.label} onClick={item.onClick} />;
            })
          );
        }

        if (flowIDs.length) {
          result.push(<Menu.Divider key="flow-divider" label="Components" fullWidth={false} />);

          result.push(
            ...flowIDs.map((id) => {
              const item = itemMap[id];

              return <Menu.Item key={id} label={item.label} onClick={item.onClick} />;
            })
          );
        }

        if (intentIDs.length) {
          result.push(<Menu.Divider key="intent-divider" label="Intents" fullWidth={false} />);

          result.push(
            ...intentIDs.map((id) => {
              const item = itemMap[id];

              return <Menu.Item key={id} label={item.label} onClick={item.onClick} />;
            })
          );
        }

        return result;
      }),
    []
  );

  const getContent = ({ items }: { items: string[] }) => getContentMemoized(items, getReferrerItem);

  const firstItem = getReferrerItem(firstRefererID);

  return (
    <CMSTableLinkMenuCell
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      label={`${firstItem?.label ?? ''}${refererIDs.length > 1 ? ` (${refererIDs.length})` : ''}`}
      items={refererIDs}
      onClick={firstItem?.onClick ?? (() => null)}
    >
      {getContent}
    </CMSTableLinkMenuCell>
  );
};
