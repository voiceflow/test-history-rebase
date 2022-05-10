import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { InteractionModelTabType } from '@/constants';
import { EmptyDash } from '@/pages/NLUManager/components';
import { useIsCheckedItem } from '@/pages/NLUManager/components/Content/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { TableMeta } from '../../constants';
import { EllipsisCell } from '..';
import TableItem from '../TableItem';
import NameBox from '../TableItem/NameBox';

const EntityItem: React.FC<{ item: Realtime.Slot }> = ({ item }) => {
  const EntityTableColumnMeta = TableMeta[InteractionModelTabType.SLOTS].columns;
  const { toggleCheckedItem } = React.useContext(NLUManagerContext);

  const { isChecked } = useIsCheckedItem(item.id);
  const values = item.inputs.map(({ value }) => value);

  return (
    <TableItem itemType={InteractionModelTabType.SLOTS} item={item}>
      <Box display="inline-block" mr={12}>
        <Checkbox checked={isChecked} onChange={() => toggleCheckedItem(item.id)} />
      </Box>
      <NameBox flex={EntityTableColumnMeta[0].flexWidth} name={item.name} />
      <Box flex={EntityTableColumnMeta[1].flexWidth}>{item.type}</Box>
      <EllipsisCell flex={EntityTableColumnMeta[2].flexWidth}>
        {values.length ? (
          <>
            {values.map((value, index) => {
              return (
                <>
                  {index !== 0 && ', '}
                  {value}
                </>
              );
            })}
          </>
        ) : (
          <BoxFlex alignItems="center" style={{ height: '100%' }}>
            <EmptyDash />
          </BoxFlex>
        )}
      </EllipsisCell>
    </TableItem>
  );
};

export default EntityItem;
