import React from 'react';

import type { Domain } from '../types';
import * as S from './styles';

export const DomainRow: React.FC<{ item: Domain }> = ({ item }) => {
  return <S.DomainRow>{item.name}</S.DomainRow>;
};
