import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import { isSystemVariableName } from '@voiceflow/utils-designer';
import React from 'react';

import { CMS_VARIABLE_LEARN_MORE } from '@/constants/link.constant';
import { EMPTY_TEST_ID, TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useOnVariableCreate, useVariableCMSManager } from '../../CMSVariable.hook';
import { variableColumnsOrderAtom } from './CMSVariableTable.atom';
import { CMS_VARIABLE_TABLE_CONFIG } from './CMSVariableTable.config';
import { VariableTableColumn } from './CMSVariableTable.constant';

export const CMSVariableTable: React.FC = () => {
  const onCreate = useOnVariableCreate();
  const onRowClick = useCMSRowItemClick();
  const cmsManager = useVariableCMSManager();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({
    canRename: (resourceID) => !isSystemVariableName(resourceID),
    canDelete: (resourceID) => !isSystemVariableName(resourceID),
    nameColumnType: VariableTableColumn.NAME,
  });

  return (
    <CMSEmpty
      title="No variables exist"
      button={{ label: 'Create variable', onClick: (search) => onCreate({ name: search }), testID: tid(EMPTY_TEST_ID, 'create-variable') }}
      searchTitle="No variables found"
      description="Variables are like containers that hold information. You can store data in them and use or remember it later. "
      illustration="NoContent"
      learnMoreLink={CMS_VARIABLE_LEARN_MORE}
    >
      <Table
        config={CMS_VARIABLE_TABLE_CONFIG}
        itemsAtom={cmsManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={variableColumnsOrderAtom}
        testID={TABLE_TEST_ID}
      />
    </CMSEmpty>
  );
};
