import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu, useCMSRowItemNavigate } from '../../../../hooks/cms-row-item.hook';
import { useFunctionCMSManager, useOnFunctionCreate } from '../../CMSFunction.hook';
import { CMSFunctionCodeEditor } from '../CMSFunctionCodeEditor/CMSFunctionCodeEditor.component';
import { functionColumnsOrderAtom } from './CMSFunctionTable.atom';
import { FUNCTION_TABLE_CONFIG } from './CMSFunctionTable.config';
import { FunctionTableColumn } from './CMSFunctionTable.constant';

export const CMSFunctionTable: React.FC = () => {
  const exportMany = useDispatch(Designer.Function.effect.exportMany);
  const onCreate = useOnFunctionCreate();
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const rowContextMenu = useCMSRowItemContextMenu({
    nameColumnType: FunctionTableColumn.NAME,
    onExport: (functionID) => exportMany([functionID]),
  });
  const functionCMSManager = useFunctionCMSManager();

  const tableState = Table.useStateMolecule();
  const functionID = useAtomValue(tableState.activeID);

  if (functionID) return <CMSFunctionCodeEditor functionID={functionID} />;

  return (
    <CMSEmpty
      title="No functions exist"
      button={{ label: 'Create function', onClick: (search) => onCreate({ name: search }) }}
      searchTitle="No functions found"
      description="Functions can be used to create reusable code, make API calls, and transforming data. "
      illustration="Functions"
      learnMoreLink={CMS_FUNCTIONS_LEARN_MORE}
    >
      <Table
        config={FUNCTION_TABLE_CONFIG}
        itemsAtom={functionCMSManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={functionColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};
