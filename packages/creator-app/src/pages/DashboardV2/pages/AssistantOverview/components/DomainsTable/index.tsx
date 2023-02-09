import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, FlexCenter, Link, Table } from '@voiceflow/ui';
import React from 'react';

import SearchBar from '@/components/SearchBar';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import { usePlanLimitedAction } from '@/hooks/planLimitV2';
import * as ModalsV2 from '@/ModalsV2';

import { StatusSelect } from './components';
import { COLUMNS, TableColumn } from './constants';
import { FilterContextProvider } from './context';
import * as S from './styles';

interface DomainsTableProps {
  domains: Realtime.Domain[];
}

const DomainsTable: React.FC<DomainsTableProps> = ({ domains }) => {
  const createModal = ModalsV2.useModal(ModalsV2.Domain.Create);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const [domainEditPermission] = usePermission(Permission.DOMAIN_EDIT);
  const columnsToRender = domainEditPermission ? COLUMNS : COLUMNS.slice(0, -1);

  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterBy = React.useMemo(() => [search, status], [search, status]);

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: domains,
    columns: columnsToRender,
    filterBy,
    initialOrderBy: TableColumn.MODIFIED,
    getItemFilterBy: ({ name, status = BaseModels.Version.DomainStatus.DESIGN }) => [name, status],
  });

  const onCreate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: domains.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: () => createModal.openVoid({ name: search }),
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
              <SearchBar value={search} autoFocus placeholder="Search domains" onSearch={setSearch} />
            </Box>

            <StatusSelect value={status} items={domains} onChange={setStatus} />
          </Box.Flex>

          {domainEditPermission && (
            <S.Actions>
              <Button onClick={() => onCreate()} squareRadius>
                New Domain
              </Button>
            </S.Actions>
          )}
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
          columns={columnsToRender}
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
