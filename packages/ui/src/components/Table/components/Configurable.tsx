import React from 'react';

import OverflowTippyTooltip from '../../OverflowTippyTooltip';
import * as T from '../types';
import Column from './Column';
import Ellipses from './Ellipses';
import Header from './Header';
import Row from './Row';
import Table from './Table';

const Configurable = <T extends string, I extends T.Item>({
  items,
  empty,
  columns,
  orderBy,
  renderRow = ({ children }) => <Row>{children}</Row>,
  descending,
  onChangeOrderBy,
}: T.ConfigurableProps<T, I>) => (
  <Table
    items={items}
    empty={empty}
    header={
      <Header>
        {columns.map(({ type, flex, label, sorter, tooltip }) => (
          <Header.Column
            key={type}
            flex={flex}
            active={type === orderBy}
            tooltip={tooltip}
            onClick={() => sorter && onChangeOrderBy?.(type)}
            sortable={!!sorter}
            descending={descending}
          >
            {label}
          </Header.Column>
        ))}
      </Header>
    }
    renderRow={(props) =>
      renderRow({
        ...props,
        children: columns.map(({ type, flex, ellipses, component: Component, overflowTooltip }) =>
          ellipses ? (
            <Column key={type} flex={flex}>
              <OverflowTippyTooltip<HTMLDivElement> style={{ display: 'block', width: '100%' }} {...overflowTooltip?.(props)}>
                {(ref) => (
                  <Ellipses ref={ref}>
                    <Component {...props} />
                  </Ellipses>
                )}
              </OverflowTippyTooltip>
            </Column>
          ) : (
            <Column key={type} flex={flex}>
              <Component {...props} />
            </Column>
          )
        ),
      })
    }
  />
);

export default Configurable;
