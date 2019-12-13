import React from 'react';
import { Tooltip } from 'react-tippy';

import { UserListCardWrapper } from '@/admin/components/UserListCard/styles';
import User from '@/admin/containers/Home/components/User';

const UserListCard = (props) => {
  const { user } = props;
  return (
    <UserListCardWrapper>
      <User user={user} className="beta-user-icon" />
      <div className="user-info">
        <div className="name">{user.name}</div>
        <div className="email">{user.email}</div>
      </div>
      <div className="delete">
        <Tooltip title="Remove from Beta" position="top">
          <i className="fal fa-trash delete-icon" onClick={() => props.removeUser(user.creator_id)} />
        </Tooltip>
      </div>
    </UserListCardWrapper>
  );
};

export default UserListCard;
