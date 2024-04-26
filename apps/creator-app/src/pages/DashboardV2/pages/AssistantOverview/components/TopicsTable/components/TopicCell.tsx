import type { TableTypes } from '@voiceflow/ui';
import { getNestedMenuFormattedLabel } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import * as S from '../../tableStyles';
import { FilterContext } from '../context';
import type { Topic } from '../types';

const TopicCell: React.FC<TableTypes.ItemProps<Topic>> = ({ item }) => {
  const { search } = React.useContext(FilterContext);

  const goToTopic = useDispatch(Router.goToDiagram, item.id);

  return (
    <S.NameCell onClick={() => goToTopic()} textDecoration>
      {getNestedMenuFormattedLabel(item.name, search)}
    </S.NameCell>
  );
};

export default TopicCell;
