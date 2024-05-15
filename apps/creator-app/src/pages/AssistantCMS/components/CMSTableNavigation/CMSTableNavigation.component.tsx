import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import { atom, useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { Designer } from '@/ducks';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';

import { TABLE_TEST_ID } from '../../AssistantCMS.constant';
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

  const folders = useAtomValue(cmsRouteFolders.folders);
  const folderScope = useAtomValue(cmsManager.folderScope);
  const rootPathname = useAtomValue(cmsRouteFolders.rootPathname);
  const hasSelectedItems = useAtomValue(useMemo(() => atom((get) => !!get(tableState.selectedIDs).size), [tableState.selectedIDs]));
  const allResourcesCount = useSelector(Designer.utils.getCMSResourceCountSelector(folderScope));

  return hasSelectedItems && !!React.Children.count(actions) ? (
    <CMSResourceActions className={container} actions={actions} />
  ) : (
    <Table.Navigation
      testID={tid(TABLE_TEST_ID, 'navigation')}
      className={container}
      breadCrumbsItems={[
        {
          label: `${label} (${allResourcesCount})`,
          onClick: stopPropagation(onLabelClick ? () => onLabelClick(rootPathname) : onLinkClick(rootPathname)),
        },
        ...folders.map((folder) => ({
          label: folder.name,
          onClick: stopPropagation(onLinkClick(folder.pathname, { params: { folderID: folder.id } })),
        })),
        ...items,
      ]}
      onImportClick={onImportClick}
    >
      {children}
    </Table.Navigation>
  );
};
