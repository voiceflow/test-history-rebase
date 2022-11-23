import React from 'react';

import OverflowTippyTooltip from '../../OverflowTippyTooltip';
import { RowProvider } from '../contexts';
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
  renderRow = ({ children, onMouseEnter, onMouseLeave }) => (
    <Row onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </Row>
  ),
  descending,
  onChangeOrderBy,
  scrolled,
  stickyHeader = true,
  hideLastDivider = false,
}: T.ConfigurableProps<T, I>) => (
  <Table
    hideLastDivider={hideLastDivider}
    items={items}
    empty={empty}
    header={
      <Header scrolled={scrolled} stickyHeader={stickyHeader}>
        {columns.map(({ type, flex, label, width, sorter, tooltip }) => (
          <Header.Column
            key={type}
            flex={flex}
            width={width}
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
    renderRow={(props) => (
      <RowProvider {...props}>
        {(providerProps) =>
          renderRow({
            ...props,
            ...providerProps,
            children: columns.map(({ type, flex, width, ellipses, component: Component, overflowTooltip }) =>
              ellipses ? (
                <Column
                  key={type}
                  flex={flex}
                  width={width}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <OverflowTippyTooltip<HTMLDivElement> overflow {...overflowTooltip?.(props)}>
                    {(ref) => (
                      <Ellipses ref={ref}>
                        <Component {...props} />
                      </Ellipses>
                    )}
                  </OverflowTippyTooltip>
                </Column>
              ) : (
                <Column key={type} flex={flex} width={width}>
                  <Component {...props} />
                </Column>
              )
            ),
          })
        }
      </RowProvider>
    )}
  />
);

export default Configurable;
