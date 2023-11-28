import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as S from '@/pages/Settings/components/ProjectVersions/components/VersionList/components/VersionItem/styles';

import { EnvironmentRef } from './types';

interface EnvironmentItemProps {
  environmentRef: EnvironmentRef;
}

const EnvironmentItem: React.FC<EnvironmentItemProps> = ({ environmentRef }) => {
  const {
    environment: { creatorID },
    tag,
  } = environmentRef;

  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  const capitalizedTag = React.useMemo(() => tag.charAt(0).toUpperCase() + tag.slice(1), [tag]);

  return (
    <S.RowItem>
      <S.ColumnItemContainer>
        <S.StatusIndicatorContainer style={{ justifyContent: 'flex-start' }}>
          <S.StatusIndicator size={12} isLive={tag === 'production'} />
          {capitalizedTag}
        </S.StatusIndicatorContainer>
      </S.ColumnItemContainer>

      <S.ColumnItemContainer>{member?.name ?? 'Unknown'}</S.ColumnItemContainer>
    </S.RowItem>
  );
};

export default EnvironmentItem;
