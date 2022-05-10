import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import EmptyView from '@/pages/Canvas/components/NLUQuickView/components/EmptyView';
import { ItemsContainer } from '@/pages/NLUManager/components/Content/components/Table/components';
import { NLUManagerContext } from '@/pages/NLUManager/context';

interface TableProps {
  items: Realtime.Intent[] | Realtime.Slot[] | Variable[];
  ItemComponent: React.FC<any>;
}

const Table: React.FC<TableProps> = ({ ItemComponent, items }) => {
  const { activeTab, createAndSelect } = React.useContext(NLUManagerContext);

  return (
    <>
      {items.length ? (
        <ItemsContainer>
          {items.map((item) => {
            return (
              <Box key={item.id}>
                <ItemComponent item={item} />
              </Box>
            );
          })}
          <Box borderTop="1px solid #dfe3ed" mt={-1} />
        </ItemsContainer>
      ) : (
        <Box pb={60} display="grid" alignContent="center" height="100%">
          <EmptyView onCreate={createAndSelect} pageType={activeTab} />
        </Box>
      )}
    </>
  );
};

export default Table;
