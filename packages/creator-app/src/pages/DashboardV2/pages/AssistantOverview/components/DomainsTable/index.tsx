import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, FlexCenter, Input, Link, Table } from '@voiceflow/ui';
import React from 'react';

import { StatusSelect } from './components';
import { COLUMNS, TableColumn } from './constants';
import { FilterContextProvider } from './context';
import * as S from './styles';

interface DomainsTableProps {
  domains: Realtime.Domain[];
}

const DomainsTable: React.FC<DomainsTableProps> = ({ domains }) => {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterBy = React.useMemo(() => [search, status], [search, status]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: domains,
    columns: COLUMNS,
    filterBy,
    initialOrderBy: TableColumn.MODIFIED,
    getItemFilterBy: ({ name, status = BaseModels.Version.DomainStatus.DESIGN }) => [name, status],
  });

  const clearFilters = () => {
    setStatus('');
    setSearch('');
  };

  return (
    <FilterContextProvider search={search} status={status}>
      <S.Container>
        <S.Header>
          <Box.Flex gap={12}>
            <Box width={230}>
              <Input
                icon={search ? 'close' : 'search'}
                value={search}
                autoFocus
                iconProps={{ size: 16, color: 'rgba(110, 132, 154)', onClick: () => setSearch(''), clickable: !!search, opacity: true }}
                placeholder="Search domains"
                onChangeText={setSearch}
              />
            </Box>

            <StatusSelect value={status} items={domains} onChange={setStatus} />
          </Box.Flex>

          <S.Actions>
            <Button squareRadius>New Domain</Button>
          </S.Actions>
        </S.Header>

        <Table.Configurable
          empty={
            <FlexCenter>
              <Box top={29} position="relative" textAlign="center" color="#132144" maxWidth={250}>
                No domains found. <Link onClick={clearFilters}>Clear filters</Link>
              </Box>
            </FlexCenter>
          }
          items={items}
          orderBy={orderBy}
          columns={COLUMNS}
          renderRow={(props) => <S.Row {...props} />}
          descending={descending}
          stickyHeader={false}
          onChangeOrderBy={onChangeOrderBy}
          hideLastDivider
        />
      </S.Container>
    </FilterContextProvider>
  );
};

export default DomainsTable;
