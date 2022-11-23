import React from 'react';

import type { Domain } from '../types';
import * as S from './styles';

export const TopicRow: React.FC<{ item: Domain }> = ({ item }) => {
  return <S.TopicRow>{item.topicIDs.length}</S.TopicRow>;
};
