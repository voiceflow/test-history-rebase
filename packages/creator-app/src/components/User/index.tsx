import { Flex, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { LockOwner } from '@/models';
import { Identifier } from '@/styles/constants';

import { AddMemberIcon, MemberIcon, MembersContainer, MembersWrapper } from './components';
import { MemberIconProps } from './components/MemberIcon';

export * from './components';

export type UserProps = MemberIconProps & {
  user: LockOwner;
  className?: string;
  pending?: boolean;
};

const User = React.forwardRef<HTMLDivElement, UserProps>(({ user, className, pending, ...props }, ref) => {
  if (pending) {
    return (
      <MemberIcon className={className} ref={ref} {...props}>
        <SvgIcon icon="clock" size={12} />
      </MemberIcon>
    );
  }

  if (!user?.image) {
    return (
      <MemberIcon className={className} ref={ref} {...props}>
        ?
      </MemberIcon>
    );
  }

  const style: React.CSSProperties = {};
  let letter = null;

  if (user.image.length === 13 && user.image.includes('|')) {
    const colors = user.color ? user.color.split('|') : user.image.split('|');
    style.backgroundColor = `#${colors[1]}`;
    style.color = `#${colors[0]}`;
    [letter] = user.name;
  } else {
    style.backgroundImage = `url(${user.image})`;
  }

  return (
    <MemberIcon className={className} style={style} ref={ref} {...props}>
      {letter}
    </MemberIcon>
  );
});

export default User;

export type MembersProps = {
  members: LockOwner[];
  onAdd?: () => void;
  min?: number;
  max?: number;
};

export const Members: React.FC<MembersProps> = ({ min = 0, max = 8, onAdd, members }) => {
  const accepted = members.filter((member) => !!member.creator_id).reverse();

  if (!accepted || accepted.length <= min) {
    return null;
  }

  return (
    <MembersContainer>
      <MembersWrapper>
        {accepted.slice(0, max).map((member, index) => (
          <TippyTooltip style={{ zIndex: max - index }} key={member.tabID || member.creator_id} title={member.name} position="bottom">
            <User user={member} />
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
                {accepted.slice(max).map((member) => (
                  <>
                    {member.name}
                    <br />
                  </>
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
