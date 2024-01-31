import { Table } from '@voiceflow/ui-next';
import { atom, useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import * as Project from '@/ducks/projectV2';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { CMSResourceActions } from '../CMSResourceActions';
import { container } from './CMSTableNavigation.css';
import type { ICMSTableNavigation } from './CMSTableNavigation.interface';

export const CMSTableNavigation: React.FC<ICMSTableNavigation> = ({ label, items = [], actions, onImportClick, onLabelClick, children }) => {
  const tableState = Table.useStateMolecule();
  const cmsManager = useCMSManager();
  const onLinkClick = useOnLinkClick();
  const cmsRouteFolders = useCMSRouteFolders();
  const hasSelectedItems = useAtomValue(useMemo(() => atom((get) => !!get(tableState.selectedIDs).size), [tableState.selectedIDs]));

  const name = useSelector(Project.active.nameSelector) ?? '';
  const folders = useAtomValue(cmsRouteFolders.folders);
  const resourceURL = useAtomValue(cmsManager.url);

  return hasSelectedItems && !!React.Children.count(actions) ? (
    <CMSResourceActions className={container} actions={actions} />
  ) : (
    <Table.Navigation
      className={container}
      breadCrumbsItems={[
        { label: name, onClick: onLinkClick(resourceURL) },
        { label, onClick: () => (onLabelClick ? onLabelClick(resourceURL) : onLinkClick(resourceURL)) },
        ...folders.map((folder) => ({
          label: `${folder.name} (${folder.count})`,
          onClick: onLinkClick(folder.url),
        })),
        ...items,
      ]}
      onImportClick={onImportClick}
      testID="cms-table__navigation"
    >
      {children}
    </Table.Navigation>
  );
};
