import './User.css';

import React from 'react';

export const User = (props) => {
  if (!props.user.image) return null;

  const style = {};
  let letter = null;
  if (props.user.image.length === 13 && props.user.image.includes('|')) {
    const colors = props.user.image.split('|');
    style.backgroundColor = `#${colors[1]}`;
    style.color = `#${colors[0]}`;
    letter = props.user.name[0];
  } else {
    style.backgroundImage = `url(${props.user.image})`;
  }

  return (
    <div className={['member-icon', props.className].join(' ')} style={style}>
      <span className="no-select">{letter}</span>
    </div>
  );
};
