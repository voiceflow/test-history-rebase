import { Table, type TableStateInitialValue } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

export const withCMSInitialTableState =
  <ColumnType extends string, SortContext = unknown>(
    initialTableState: TableStateInitialValue<ColumnType, SortContext>
  ) =>
  (Component: React.FC) =>
    setDisplayName(wrapDisplayName(Component, 'withCMSInitialTableState'))(() => {
      const config = useMemo(() => ({ ...initialTableState }), [initialTableState]);

      return (
        <Table.StateProvider value={config}>
          <Component />
        </Table.StateProvider>
      );
    });
