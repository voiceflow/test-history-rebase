import React from 'react';

import './UserCard.css';
import {User} from "components/User/User";
import moment from "moment";

const UserCard = (props) => {
  if (!props.user)
    return null;
  return (
    <div className="user_card_wrapper">

      <div className="user_card_card">
        <div className="additional">
          <div className="user-card">
            <div className="level user_card_center">
              Id: {props.user.creator_id}
            </div>
            <div className="points user_card_center">
              Admin level: {props.user.admin}
            </div>
            <User user={props.user} className="user_card_center user_logo"/>
          </div>
        </div>
        <div className="user_card_general">
          <div className="user_card_name">{props.user.name}</div>
          <div className="user_date_joined">
            {moment(props.user.created).format('MMMM Do YYYY, h:mm:ss a')}
          </div>
          <p>
            {props.user.email}
          </p>
          <p>
            {props.user.subscription ? props.user.subscription : 'No subscription active'}
          </p>
          <p>
            {props.user.strip_id ? props.user.strip_id : 'No Stripe Id'}
          </p>
          <p>
            Google ID: {props.user.gid ? props.user.gid : 'no google ID'}
          </p>
          {/*<span className="more">Mouse over the card for metadata</span>*/}
        </div>
      </div>

    </div>
  )
};

export default UserCard;