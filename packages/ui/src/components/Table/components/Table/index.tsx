import Divider from '@ui/components/Divider';
import React from 'react';

import { Provider } from '../../context';
import * as T from '../../types';
import * as S from './styles';

const Table = <T extends T.Item>({ items, empty, header, renderRow }: T.Props<T>) => (
  <Provider items={items}>
    {items.length ? (
      <S.Container>
        {header}

        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderRow({ item, index, isLast: index === items.length - 1, isFirst: index === 0 })}

            <Divider offset={0} isSecondaryColor={index !== items.length - 1} />
          </React.Fragment>
        ))}
      </S.Container>
    ) : (
      <S.EmptyContainer>{empty}</S.EmptyContainer>
    )}
  </Provider>
);

export default Table;
