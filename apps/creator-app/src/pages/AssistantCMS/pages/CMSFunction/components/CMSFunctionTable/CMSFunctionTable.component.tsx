import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import { useCMSRowItemClick, useCMSRowItemContextMenu } from '../../../../hooks/cms-row-item.hook';
import { useFunctionCMSManager, useOnFunctionCreate } from '../../CMSFunction.hook';
import { CMSFunctionCodeEditor } from '../CMSFunctionCodeEditor/CMSFunctionCodeEditor.component';
import { functionColumnsOrderAtom } from './CMSFunctionTable.atom';
import { FUNCTION_TABLE_CONFIG } from './CMSFunctionTable.config';

export const CMSFunctionTable: React.FC = () => {
  const onRowClick = useCMSRowItemClick();
  const functionCMSManager = useFunctionCMSManager();
  const onCreate = useOnFunctionCreate();
  const rowContextMenu = useCMSRowItemContextMenu();
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
        columnsOrderAtom={functionColumnsOrderAtom}
        rowContextMenu={rowContextMenu}
      />
    </CMSEmpty>
  );
};
