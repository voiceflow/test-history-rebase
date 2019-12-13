import React from 'react';

import UserContainer from './UserContainer';

const User = ({ user, className }) => {
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
    <UserContainer className={className} style={style}>
      <span className="no-select">{letter}</span>
    </UserContainer>
  );
};

export default User;
