import { System } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface MembersListProps extends React.PropsWithChildren {
  filters: React.ReactNode;
  onClearFilters: VoidFunction;
}

const MembersList: React.FC<MembersListProps> = ({ filters, children, onClearFilters }) => (
  <S.Container>
    <S.Header>
      <S.Filters>{filters}</S.Filters>
    </S.Header>

    <S.Body>
      {!children ? (
        <S.NoResults>
          <div>
            No members found. <System.Link.Button onClick={onClearFilters}>Clear filters</System.Link.Button>
          </div>
        </S.NoResults>
      ) : (
        children
      )}
    </S.Body>
  </S.Container>
);

export default MembersList;
