import React from 'react';

import OverflowTippyTooltip from '../../OverflowTippyTooltip';
import { RowProvider } from '../contexts';
import type * as T from '../types';
import Column from './Column';
import Ellipses from './Ellipses';
import Header from './Header';
import Row from './Row';
import Table from './Table';

const Configurable = <V extends string, I extends T.Item>({
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
  header,
}: T.ConfigurableProps<V, I>) => (
  <Table
    items={items}
    empty={empty}
    hideLastDivider={hideLastDivider}
    header={
      header ?? (
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
      )
    }
    renderRow={(props) => (
      <RowProvider {...props}>
        {(providerProps) =>
          renderRow({
            ...props,
            ...providerProps,
            children: columns.map(({ type, flex, width, overflow, ellipses, component: Component, overflowTooltip }) =>
              ellipses ? (
                <Column key={type} flex={flex} width={width} $overflow>
                  <OverflowTippyTooltip<HTMLDivElement> overflow {...overflowTooltip?.(props)}>
                    {(ref) => (
                      <Ellipses ref={ref}>
                        <Component {...props} />
                      </Ellipses>
                    )}
                  </OverflowTippyTooltip>
                </Column>
              ) : (
                <Column key={type} flex={flex} width={width} $overflow={overflow}>
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
