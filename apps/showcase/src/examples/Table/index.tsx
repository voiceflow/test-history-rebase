/* eslint-disable no-console */
import { flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { Button, Input, Table } from '@voiceflow/ui';
import React from 'react';
import { useVirtual } from 'react-virtual';
import { TableVirtuoso } from 'react-virtuoso';
import { FixedSizeList } from 'react-window';

import { withBox } from '../hocs';
import { createExample, createSection } from '../utils';
import { COLUMNS, REACT_TABLE_COLUMNS } from './constants';
import { TableColumn, TableItem } from './types';
import { createTableItems, fuzzyFilter } from './utils';

const wrapContainer = withBox({ width: '100%', backgroundColor: '#fff' });

export const voiceflow = createExample(
  'Voiceflow',
  wrapContainer(() => {
    const [tableItems] = React.useState(() => createTableItems(10000));
    const columnsToRender = React.useMemo(() => COLUMNS, [tableItems]);
    const [renderTable, setRenderTable] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [descending, setDescending] = React.useState(false);

    const filterBy = React.useMemo(() => [search], [search]);

    const { items, orderBy, onChangeOrderBy } = Table.useFilterOrderItems({
      items: tableItems,
      columns: columnsToRender,
      filterBy,
      initialOrderBy: TableColumn.NAME,
      getItemFilterBy: ({ name }) => [name],
    });

    return (
      <div>
        <Input placeholder="search" value={search} onChangeText={setSearch} />

        <Button onClick={() => setDescending(!descending)}>change order</Button>

        <Button onClick={() => setRenderTable(!renderTable)}>{renderTable ? 'hide VF table' : 'render VF table'}</Button>

        {renderTable && (
          <React.Profiler id="voiceflow-table" onRender={console.log}>
            <Table.Configurable
              empty={<div>is empty</div>}
              items={items}
              orderBy={orderBy}
              columns={columnsToRender}
              descending={descending}
              stickyHeader={false}
              onChangeOrderBy={onChangeOrderBy}
              hideLastDivider
            />
          </React.Profiler>
        )}
      </div>
    );
  })
);

export const reactTable = createExample(
  'React Table',
  wrapContainer(() => {
    const [tableItems] = React.useState(() => createTableItems(10000));
    const [renderTable, setRenderTable] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const table = useReactTable({
      data: tableItems,
      columns: REACT_TABLE_COLUMNS,
      getCoreRowModel: getCoreRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
      },
      state: {
        globalFilter: search,
      },
      onGlobalFilterChange: setSearch,
    });

    return (
      <div>
        <Input placeholder="search" value={search} onChangeText={setSearch} />

        <Button onClick={() => setRenderTable(!renderTable)}>{renderTable ? 'hide react table' : 'render react table'}</Button>

        {renderTable && (
          <React.Profiler id="react-table" onRender={console.log}>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          </React.Profiler>
        )}
      </div>
    );
  })
);

export const reactVirtualizedTable = createExample(
  'React Virtualized Table',
  wrapContainer(() => {
    const [tableItems] = React.useState(() => createTableItems(10000));
    const [renderTable, setRenderTable] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const table = useReactTable({
      data: tableItems,
      columns: REACT_TABLE_COLUMNS,
      getCoreRowModel: getCoreRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
      },
      state: {
        globalFilter: search,
      },
      onGlobalFilterChange: setSearch,
    });

    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtual({
      parentRef: tableContainerRef,
      size: rows.length,
      overscan: 10,
    });

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

    console.log('re-render');

    return (
      <div>
        <Input placeholder="search" value={search} onChangeText={setSearch} />

        <Button onClick={() => setRenderTable(!renderTable)}>
          {renderTable ? 'hide react virtualized table' : 'render react virtualized table'}
        </Button>

        {renderTable && (
          <React.Profiler id="react-table" onRender={console.log}>
            <div
              ref={tableContainerRef}
              style={{
                border: '1px solid lightgray',
                height: '500px',
                overflow: 'auto',
              }}
            >
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} />
                    </tr>
                  )}

                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<TableItem>;

                    return (
                      <tr key={row.id} data-index={virtualRow.index} ref={rowVirtualizer.measure}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    );
                  })}

                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} />
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              </table>
            </div>
          </React.Profiler>
        )}
      </div>
    );
  })
);

export const reactWindowTable = createExample(
  'React Window Table',
  wrapContainer(() => {
    const [tableItems] = React.useState(() => createTableItems(10000));
    const [renderTable, setRenderTable] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const table = useReactTable({
      data: tableItems,
      columns: REACT_TABLE_COLUMNS,
      getCoreRowModel: getCoreRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
      },
      state: {
        globalFilter: search,
      },
      onGlobalFilterChange: setSearch,
      globalFilterFn: fuzzyFilter,
    });

    const { rows } = table.getRowModel();

    console.log('re-render');

    const Row = ({ index, style }: { index: number; style: any }) => {
      const row = rows[index] as Row<TableItem>;

      return (
        <div key={row.id} style={{ ...style, display: 'flex' }}>
          {row.getVisibleCells().map((cell) => (
            <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
          ))}
        </div>
      );
    };

    return (
      <div>
        <Input placeholder="search" value={search} onChangeText={setSearch} />

        <Button onClick={() => setRenderTable(!renderTable)}>
          {renderTable ? 'hide react virtualized table' : 'render react virtualized table'}
        </Button>

        {renderTable && (
          <React.Profiler id="react-table" onRender={console.log}>
            <div
              style={{
                border: '1px solid lightgray',
                height: '500px',
                overflow: 'auto',
              }}
            >
              <div>
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <div key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    ))}
                  </div>
                ))}
                <div>
                  <FixedSizeList height={500} itemCount={rows.length} width={500} itemSize={40}>
                    {Row}
                  </FixedSizeList>
                </div>
                <div>
                  {table.getFooterGroups().map((footerGroup) => (
                    <div key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <div key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </React.Profiler>
        )}
      </div>
    );
  })
);

export const reactVirtuosoTable = createExample(
  'React Virtuoso Table',
  wrapContainer(() => {
    const [tableItems] = React.useState(() => createTableItems(10000));
    const [renderTable, setRenderTable] = React.useState(false);

    const table = useReactTable({
      data: tableItems,
      columns: REACT_TABLE_COLUMNS,
      getCoreRowModel: getCoreRowModel(),
      filterFns: {
        fuzzy: fuzzyFilter,
      },
    });

    const { rows } = table.getRowModel();

    console.log('re-render');

    return (
      <div>
        <Button onClick={() => setRenderTable(!renderTable)}>
          {renderTable ? 'hide react virtualized table' : 'render react virtualized table'}
        </Button>

        {renderTable && (
          <React.Profiler id="react-table" onRender={console.log}>
            <div
              style={{
                border: '1px solid lightgray',
                height: '500px',
                overflow: 'auto',
              }}
            >
              <TableVirtuoso
                style={{ height: '100%', minWidth: 600 }}
                totalCount={rows.length}
                overscan={1000}
                components={{
                  Table: ({ style, ...props }) => <table {...props} style={{ ...style, width: 800, tableLayout: 'fixed' }} />,
                  TableBody: React.forwardRef(({ style, ...props }, ref) => <tbody {...props} ref={ref} />),
                  TableRow: (props) => {
                    const index = props['data-index'];
                    const row = rows[index];
                    return <tr key={row.id} {...props} />;
                  },
                }}
                fixedHeaderContent={() => {
                  return table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ));
                }}
                itemContent={(index) => {
                  const row = rows[index];
                  return row.getVisibleCells().map((cell) => {
                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                  });
                }}
              />
            </div>
          </React.Profiler>
        )}
      </div>
    );
  })
);

export default createSection('Table', 'src/components/Table/index.tsx', [
  // voiceflow,
  // reactTable,
  reactVirtualizedTable,
  // reactWindowTable,
  // reactVirtuosoTable,
]);
