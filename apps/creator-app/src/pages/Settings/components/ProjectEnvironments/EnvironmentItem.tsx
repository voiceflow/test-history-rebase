import { Box, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import * as S from './styles';
import type { EnvironmentRef } from './types';

interface EnvironmentItemProps {
  environmentRef: EnvironmentRef;
}

const EnvironmentItem: React.FC<EnvironmentItemProps> = ({ environmentRef }) => {
  const {
    environment: { creatorID, updatedAt, name },
    tag,
  } = environmentRef;

  const member = useSelector(WorkspaceV2.active.members.memberByIDSelector, { creatorID });

  const capitalizedTag = React.useMemo(() => tag.charAt(0).toUpperCase() + tag.slice(1), [tag]);

  return (
    <S.RowItem>
      <S.ColumnItemContainer>
        <TippyTooltip content={dayjs(updatedAt).format('MMM DD, YYYY, h:mm A')}>
          {dayjs(updatedAt).fromNow()}
        </TippyTooltip>
      </S.ColumnItemContainer>

      <S.ColumnItemContainer>{name}</S.ColumnItemContainer>

      <S.ColumnItemContainer>{member?.name ?? 'Unknown'}</S.ColumnItemContainer>

      <S.ColumnItemContainer>
        <Box.FlexEnd>
          <S.StatusIndicatorContainer style={{ justifyContent: 'flex-start' }}>
            <S.StatusIndicator size={12} isLive={tag === 'production'} />
            {capitalizedTag}
          </S.StatusIndicatorContainer>
        </Box.FlexEnd>
      </S.ColumnItemContainer>
    </S.RowItem>
  );
};

export default EnvironmentItem;
