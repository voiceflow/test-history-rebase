import Divider from '@ui/components/Divider';
import React from 'react';

import { Provider } from '../../contexts';
import type { Item, Props } from '../../types';
import Container from '../Container';
import * as S from './styles';

const Table = <T extends Item>({ items, empty, header, renderRow, hideLastDivider }: Props<T>) => (
  <Provider items={items}>
    {items.length ? (
      <Container>
        {header}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.id}>
              {renderRow({ item, index, isLast, isFirst: index === 0 })}

              {hideLastDivider && isLast ? null : <Divider offset={0} isSecondaryColor={index !== items.length - 1} />}
            </React.Fragment>
          );
        })}
      </Container>
    ) : (
      <S.EmptyContainer>{empty}</S.EmptyContainer>
    )}
  </Provider>
);

export default Table;
