import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';

import { AddMemberIcon, MemberIcon, MembersContainer, MembersWrapper } from './components';

export * from './components';

// eslint-disable-next-line react/display-name
const User = React.forwardRef(({ user, className, pending, ...props }, ref) => {
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

  const style = {};
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

export const Members = ({ min = 0, max = 8, onAdd, members }) => {
  const accepted = members.filter((m) => !!m.creator_id).reverse();

  if (!accepted || accepted.length <= min) {
    return null;
  }

  return (
    <MembersContainer>
      <MembersWrapper>
        {accepted.slice(0, max).map((m, i) => (
          <div key={m.tabID || m.creator_id} style={{ zIndex: max - i, position: 'relative' }}>
            <Tooltip title={m.name} position="bottom">
              <User user={m} />
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
        <Tooltip
          html={accepted.slice(max).map((m) => (
            <>
              {m.name}
              <br />
            </>
          ))}
          position="bottom"
        >
          <div className="text-muted no-select">+{accepted.length - max}</div>
        </Tooltip>
      )}
    </MembersContainer>
  );
};
