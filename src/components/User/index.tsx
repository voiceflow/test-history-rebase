import React from 'react';
import { Tooltip } from 'react-tippy';

import FlexCenter from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { LockOwner } from '@/models';

import { AddMemberIcon, MemberIcon, MembersContainer, MembersWrapper } from './components';
import { MemberIconProps } from './components/MemberIcon';

export * from './components';

export type UserProps = MemberIconProps & {
  user: LockOwner;
  className?: string;
  pending?: boolean;
};

// eslint-disable-next-line react/display-name
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
    letter = user.name[0];
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
  onAdd: () => void;
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
          <div key={member.tabID || member.creator_id} style={{ zIndex: max - index, position: 'relative' }}>
            <Tooltip title={member.name} position="bottom">
              <User user={member} />
            </Tooltip>
          </div>
        ))}

        {onAdd && (
          <Tooltip title="Add Collaborators" position="bottom">
            <AddMemberIcon onClick={onAdd}>
              <SvgIcon icon="plus" size={12} />
            </AddMemberIcon>
          </Tooltip>
        )}
      </MembersWrapper>

      {accepted.length > max && (
        <FlexCenter>
          <Tooltip
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
          </Tooltip>
        </FlexCenter>
      )}
    </MembersContainer>
  );
};
