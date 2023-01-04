import * as Realtime from '@voiceflow/realtime-sdk';
import { getNestedMenuFormattedLabel, TableTypes } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { FilterContext } from '../../context';
import * as S from './styles';

const DomainCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const { search } = React.useContext(FilterContext);

  const goToDomainDiagram = useDispatch(Router.goToDomainDiagram, item.id, item.rootDiagramID);

  return (
    <S.Container onClick={() => goToDomainDiagram()} $textDecoration>
      {getNestedMenuFormattedLabel(item.name, search)}
    </S.Container>
  );
};

export default DomainCell;
