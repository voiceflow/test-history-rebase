import { Box, Button, FlexCenter, Input, Link, Table } from '@voiceflow/ui';
import React from 'react';

import { DomainsSelect } from './components/Select';
import { COLUMNS, TableColumn } from './constants';
import * as S from './styles';
import { Domains } from './types';

const DomainsTable: React.FC<{ domains: Domains }> = ({ domains }) => {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterBy = React.useMemo(() => [search, status], [search, status]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: domains,
    columns: COLUMNS,
    filterBy,
    initialOrderBy: TableColumn.MODIFIED,
    getItemFilterBy: ({ name, status = '' }) => [name, status],
  });

  const clearFilters = () => {
    setStatus('');
    setSearch('');
  };

  return (
    <S.Container>
      <S.Header>
        <S.Filters>
          <Input
            icon={search ? 'close' : 'search'}
            value={search}
            autoFocus
            iconProps={{ size: 16, color: 'rgba(110, 132, 154)', onClick: () => search && setSearch(''), clickable: true }}
            placeholder="Search domains"
            onChangeText={setSearch}
          />

          <DomainsSelect value={status} items={domains} onChange={(value) => setStatus(value)} />
        </S.Filters>

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
        onChangeOrderBy={onChangeOrderBy}
        stickyHeader={false}
        hideLastDivider
      />
    </S.Container>
  );
};

export default DomainsTable;
