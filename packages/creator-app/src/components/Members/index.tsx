import { Flex, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import User, { UserProps } from '@/components/User';
import { Identifier } from '@/styles/constants';

import { AddMemberIcon, MembersContainer, MembersWrapper } from './components';

export * from './components';

export interface MembersProps {
  min?: number;
  max?: number;
  flat?: boolean;
  onAdd?: () => void;
  members: NonNullable<UserProps['user']>[];
}

const Members: React.FC<MembersProps> = ({ min = 0, max = 8, flat, onAdd, members }) => {
  const accepted = React.useMemo(() => members.filter((member) => !!member.creator_id).reverse(), [members]);
  const renderMembers = React.useMemo(() => accepted.slice(0, max), [max, accepted]);
  const hiddenMembers = React.useMemo(() => accepted.slice(max), [max, accepted]);

  if (accepted.length <= min) {
    return null;
  }

  return (
    <MembersContainer>
      <MembersWrapper>
        {renderMembers.map((member, index) => (
          <TippyTooltip
            key={member.creator_id || index}
            style={{ zIndex: max - index }}
            title={member.name ?? ''}
            position="bottom"
            disabled={!member.creator_id}
          >
            <User flat={flat} user={member} />
          </TippyTooltip>
        ))}

        {onAdd && (
          <TippyTooltip title="Add Collaborators" position="bottom">
            <AddMemberIcon id={Identifier.ADD_COLLABORATORS} onClick={onAdd}>
              <SvgIcon icon="plus" size={12} />
            </AddMemberIcon>
          </TippyTooltip>
        )}
      </MembersWrapper>

      {accepted.length > max && (
        <Flex>
          <TippyTooltip
            html={
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
            <div className="text-muted no-select">+{accepted.length - max}</div>
          </TippyTooltip>
        </Flex>
      )}
    </MembersContainer>
  );
};

export default Members;
