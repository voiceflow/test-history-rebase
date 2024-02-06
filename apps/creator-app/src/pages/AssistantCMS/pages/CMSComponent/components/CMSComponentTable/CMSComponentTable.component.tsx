import { Table } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_COMPONENT_LEARN_MORE } from '@/constants/link.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useComponentCMSManager, useOnComponentCreate } from '../../CMSComponent.hook';
import { componentColumnsOrderAtom } from './CMSComponentTable.atom';
import { CMS_COMPONENT_TABLE_CONFIG } from './CMSComponentTable.config';
import { ComponentTableColumn } from './CMSComponentTable.constant';

export const CMSComponentTable: React.FC = () => {
  const onCreate = useOnComponentCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useComponentCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: ComponentTableColumn.NAME,
  });

  return (
    <CMSEmpty
      title="No components exist"
      button={{ label: 'Create component', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No components found"
      description="Components are saved sets of blocks that you can reuse across your agent. "
      illustration="VFComponent"
      learnMoreLink={CMS_COMPONENT_LEARN_MORE}
    >
      <Table
        config={CMS_COMPONENT_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={componentColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};
