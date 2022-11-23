import { Box, Button, FlexCenter, Input, Link, Table } from '@voiceflow/ui';
import React from 'react';

import { DomainsSelect } from './components/Select';
import { COLUMNS, TableColumn } from './constants';
import * as S from './styles';
import { Domains } from './types';

const AssistantDomainsTable: React.FC<{ domains: Domains }> = ({ domains }) => {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterBy = React.useMemo(() => [search, status], [search, status]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    columns: COLUMNS,
    items: domains,
    filterBy,
    initialOrderBy: TableColumn.MODIFIED,
    getItemFilterBy: ({ name, status = '' }) => {
      return [name, status];
    },
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
            iconProps={{
              color: '#6E849A',
              size: 16,
              style: { cursor: search ? 'pointer' : 'default' },
              onClick: () => setSearch(''),
            }}
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

export default AssistantDomainsTable;
