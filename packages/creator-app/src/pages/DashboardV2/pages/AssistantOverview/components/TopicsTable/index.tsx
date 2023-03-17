import { Box, Button, FlexCenter, System, Table } from '@voiceflow/ui';
import React from 'react';

import SearchBar from '@/components/SearchBar';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import * as ModalsV2 from '@/ModalsV2';

import * as S from '../tableStyles';
import { COLUMNS, TableColumn, VIEWER_COLUMNS } from './constants';
import { FilterContextProvider } from './context';
import { useTopics } from './hooks';

const TopicsTable: React.FC = () => {
  const createModal = ModalsV2.useModal(ModalsV2.Topic.Create);

  const [canvasEdit] = usePermission(Permission.CANVAS_EDIT);

  const [search, setSearch] = React.useState('');

  const filterBy = React.useMemo(() => [search], [search]);
  const { topics, domainID } = useTopics();

  const columnsToRender = canvasEdit ? COLUMNS : VIEWER_COLUMNS;

  const { items, orderBy, descending, onChangeOrderBy } = Table.useFilterOrderItems({
    items: topics,
    columns: columnsToRender,
    filterBy,
    initialOrderBy: TableColumn.TOPIC,
    getItemFilterBy: ({ name }) => [name],
  });

  const clearFilters = () => {
    setSearch('');
  };

  return (
    <FilterContextProvider search={search}>
      <S.Container>
        <S.Header>
          <Box.Flex width={230}>
            <SearchBar value={search} autoFocus placeholder="Search topics" onSearch={setSearch} animateIn={false} />
          </Box.Flex>

          {canvasEdit && (
            <S.Actions>
              <Button onClick={() => domainID && createModal.openVoid({ domainID })} squareRadius>
                New Topic
              </Button>
            </S.Actions>
          )}
        </S.Header>

        <Table.Configurable
          empty={
            <FlexCenter>
              <Box top={29} position="relative" textAlign="center" color="#132144" maxWidth={250}>
                No topics found. <System.Link.Button onClick={clearFilters}>Clear filters</System.Link.Button>
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

export default TopicsTable;
