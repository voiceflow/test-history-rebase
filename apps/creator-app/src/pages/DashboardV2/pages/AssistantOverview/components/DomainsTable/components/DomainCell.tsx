import * as Realtime from '@voiceflow/realtime-sdk';
import { getNestedMenuFormattedLabel, TableTypes } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import * as S from '../../tableStyles';
import { FilterContext } from '../context';

const DomainCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const { search } = React.useContext(FilterContext);

  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram, item.id, item.rootDiagramID);

  return (
    <S.NameCell onClick={() => goToDomainDiagram()} textDecoration>
      {getNestedMenuFormattedLabel(item.name, search)}
    </S.NameCell>
  );
};

export default DomainCell;
