import React from 'react';

import Flex from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import type { UserProps } from '@/components/User';
import User from '@/components/User';
import { Identifier } from '@/styles/constants';

import * as S from './styles';

export interface AvatarListProps {
  min?: number;
  max?: number;
  small?: boolean;
  onAdd?: () => void;
  members: NonNullable<UserProps['user']>[];
}

const AvatarList: React.FC<AvatarListProps> = ({ min = 0, max = 8, onAdd, members, small }) => {
  const accepted = React.useMemo(() => members.filter((member) => !!member.creator_id).reverse(), [members]);
  const renderMembers = React.useMemo(() => accepted.slice(0, max), [max, accepted]);
  const hiddenMembers = React.useMemo(() => accepted.slice(max), [max, accepted]);

  if (accepted.length <= min) {
    return null;
  }

  return (
    <S.Container>
      <S.List>
        {renderMembers.map((member, index) => (
          <TippyTooltip
            key={member.creator_id || index}
            style={{ zIndex: max - index }}
            content={member.name ?? ''}
            position="bottom"
            disabled={!member.creator_id}
          >
            <User flat user={member} small={small} />
          </TippyTooltip>
        ))}

        {onAdd && (
          <TippyTooltip content="Add Collaborators" position="bottom">
            <S.AddIcon id={Identifier.ADD_COLLABORATORS} onClick={onAdd}>
              <SvgIcon icon="plus" size={12} />
            </S.AddIcon>
          </TippyTooltip>
        )}
      </S.List>

      {accepted.length > max && (
        <Flex>
          <TippyTooltip
            content={
              <>
                {hiddenMembers.map((member, index) => (
                  <React.Fragment key={member.creator_id || index}>
                    {member.name}
                    <br />
                  </React.Fragment>
                ))}
              </>
            }
            position="bottom"
          >
            <S.Count>+{accepted.length - max}</S.Count>
          </TippyTooltip>
        </Flex>
      )}
    </S.Container>
  );
};

export default AvatarList;
