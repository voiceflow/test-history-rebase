import React from 'react';
import { Tooltip } from 'react-tippy';

// eslint-disable-next-line react/display-name
export const User = React.forwardRef(({ user, className, ...props }, ref) => {
  if (!user.image) return null;

  const style = {};
  let letter = null;
  if (user.image.length === 13 && user.image.includes('|')) {
    const colors = user.image.split('|');
    style.backgroundColor = `#${colors[1]}`;
    style.color = `#${colors[0]}`;
    letter = user.name[0];
  } else {
    style.backgroundImage = `url(${user.image})`;
  }

  return (
    <div className={['member-icon', className].join(' ')} style={style} ref={ref} {...props}>
      <span className="no-select">{letter}</span>
    </div>
  );
});

export const Members = (props) => {
  const members = props.members.filter((m) => !!m.email);
  const accepted = members.filter((m) => !!m.creator_id);
  if (!accepted || accepted.length === 0 || members.length <= 1) {
    return null;
  }

  return (
    <div className="super-center" style={{ paddingLeft: 4, marginLeft: 15, marginRight: 15 }}>
      {members.length > 1 && (
        <div className="d-flex flex-row-reverse">
          {accepted.slice(0, 8).map((m) => {
            return (
              <Tooltip key={m.creator_id} title={m.name} position="bottom">
                <User user={m} />
              </Tooltip>
            );
          })}
        </div>
      )}
      {accepted.length > 8 && <div className="ml-3 text-muted">+{accepted.length - 8}</div>}
    </div>
  );
};
