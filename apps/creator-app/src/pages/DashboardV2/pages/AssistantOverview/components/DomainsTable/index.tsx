import { BaseModels } from '@voiceflow/base-types';
import { Box, Button, FlexCenter, System, Table } from '@voiceflow/ui';
import React from 'react';

import SearchBar from '@/components/SearchBar';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Domain from '@/ducks/domain';
import { usePermission } from '@/hooks/permission';
import { usePlanLimitedAction } from '@/hooks/planLimitV2';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';

import * as S from '../tableStyles';
import { StatusSelect } from './components';
import { COLUMNS, TableColumn, VIEWER_COLUMNS } from './constants';
import { FilterContextProvider } from './context';

const DomainsTable: React.FC = () => {
  const createModal = ModalsV2.useModal(ModalsV2.Domain.Create);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const domains = useSelector(Domain.allDomainsSelector);

  const [domainEditAllowed] = usePermission(Permission.DOMAIN_EDIT);

  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterBy = React.useMemo(() => [search, status], [search, status]);

  const columnsToRender = domainEditAllowed ? COLUMNS : VIEWER_COLUMNS;

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
              <SearchBar value={search} autoFocus placeholder="Search domains" onSearch={setSearch} animateIn={false} />
            </Box>

            <StatusSelect value={status} items={domains} onChange={setStatus} />
          </Box.Flex>

          {domainEditAllowed && (
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
                No domains found. <System.Link.Button onClick={clearFilters}>Clear filters</System.Link.Button>
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
