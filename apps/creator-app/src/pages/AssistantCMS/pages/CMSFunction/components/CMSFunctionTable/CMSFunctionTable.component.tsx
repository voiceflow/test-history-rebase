import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';
import { Designer } from '@/ducks';
import { useFeature } from '@/hooks/feature.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackPageOpenedFirstTime } from '@/hooks/tracking';
import { EMPTY_TEST_ID, TABLE_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEmpty } from '../../../../components/CMSEmpty/CMSEmpty.component';
import {
  useCMSRowItemClick,
  useCMSRowItemContextMenu,
  useCMSRowItemNavigate,
} from '../../../../hooks/cms-row-item.hook';
import { useFunctionCMSManager, useOnFunctionCreate } from '../../CMSFunction.hook';
import { CMSFunctionCodeEditor } from '../CMSFunctionCodeEditor/CMSFunctionCodeEditor.component';
import { functionColumnsOrderAtom, legacyFunctionColumnsOrderAtom } from './CMSFunctionTable.atom';
import { FUNCTION_TABLE_CONFIG } from './CMSFunctionTable.config';
import { FunctionTableColumn } from './CMSFunctionTable.constant';

export const CMSFunctionTable: React.FC = () => {
  const functionsUsedBy = useFeature(FeatureFlag.FUNCTIONS_USED_BY);

  const exportMany = useDispatch(Designer.Function.effect.exportMany);
  const duplicateOne = useDispatch(Designer.Function.effect.duplicateOne);

  const onCreate = useOnFunctionCreate();
  const onRowClick = useCMSRowItemClick();
  const onRowNavigate = useCMSRowItemNavigate();
  const functionCMSManager = useFunctionCMSManager();

  const rowContextMenu = useCMSRowItemContextMenu({
    onExport: (functionID) => exportMany([functionID]),
    canExport: (_, { isFolder }) => !isFolder,
    onDuplicate: duplicateOne,
    canDuplicate: (_, { isFolder }) => !isFolder,
    nameColumnType: FunctionTableColumn.NAME,
  });

  const tableState = Table.useStateMolecule();
  const functionID = useAtomValue(tableState.activeID);

  useTrackPageOpenedFirstTime('CMS.Functions.page-open', Designer.Function.tracking.pageOpen);

  if (functionID) return <CMSFunctionCodeEditor functionID={functionID} />;

  return (
    <CMSEmpty
      title="No functions exist"
      button={{
        label: 'Create function',
        onClick: (search) => onCreate({ name: search }),
        testID: tid(EMPTY_TEST_ID, 'create-function'),
      }}
      searchTitle="No functions found"
      description="Functions can be used to create reusable code, make API calls, and transforming data. "
      illustration="Functions"
      learnMoreLink={CMS_FUNCTIONS_LEARN_MORE}
    >
      <Table
        testID={TABLE_TEST_ID}
        config={FUNCTION_TABLE_CONFIG}
        itemsAtom={functionCMSManager.dataToRender}
        onRowClick={onRowClick}
        onRowNavigate={onRowNavigate}
        rowContextMenu={rowContextMenu}
        columnsOrderAtom={functionsUsedBy ? functionColumnsOrderAtom : legacyFunctionColumnsOrderAtom}
      />
    </CMSEmpty>
  );
};
