import { Flex, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { LockOwner } from '@/models';
import { Identifier } from '@/styles/constants';

import { AddMemberIcon, MemberIcon, MembersContainer, MembersWrapper } from './components';
import { MemberIconProps } from './components/MemberIcon';

export * from './components';

export interface UserProps extends MemberIconProps {
  user?: LockOwner;
  flat?: boolean;
  pending?: boolean;
  className?: string;
}

const isColorImage = (user: LockOwner) => !!user?.image && user.image.length === 13 && user.image.includes('|');

const User = React.forwardRef<HTMLDivElement, UserProps>(({ user, className, pending, ...props }, ref) => {
  // eslint-disable-next-line no-nested-ternary
  const letter = React.useMemo(() => (!user?.image ? '?' : isColorImage(user) ? user.name[0] : ''), [user]);

  const styles = React.useMemo(() => {
    const style: React.CSSProperties = {};

    if (!user) {
      return style;
    }

    if (isColorImage(user)) {
      const colors = user.color ? user.color.split('|') : user.image!.split('|');
      style.backgroundColor = `#${colors[1]}`;
      style.color = `#${colors[0]}`;
    } else if (user) {
      style.fontSize = '0.0009px';
      style.backgroundImage = `url(${user.image})`;
    }

    return style;
  }, [user]);

  if (pending) {
    return (
      <MemberIcon className={className} ref={ref} {...props}>
        <SvgIcon icon="clock" size={12} />
      </MemberIcon>
    );
  }

  return (
    <MemberIcon className={className} style={styles} ref={ref} {...props}>
      {letter}
    </MemberIcon>
  );
});

export default User;

export interface MembersProps {
  min?: number;
  max?: number;
  flat?: boolean;
  onAdd?: () => void;
  members: LockOwner[];
}

export const Members: React.FC<MembersProps> = ({ min = 0, max = 8, flat, onAdd, members }) => {
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
          <TippyTooltip style={{ zIndex: max - index }} key={member.tabID || member.creator_id} title={member.name} position="bottom">
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
                {hiddenMembers.map((member) => (
                  <React.Fragment key={member.creator_id}>
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
