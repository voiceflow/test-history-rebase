import React from 'react';

import './UserCard.css';
import {User} from "components/User/User";
import moment from "moment";
import AdminAdvancedModal from "../AdminAdvancedModal/AdminAdvancedModal";
import {toast} from "react-toastify";
import axios from "axios";

class UserCard extends React.Component {

  refundUser = () => {
    if (!this.props.user.creator_id) {
      toast.error("No user id entered");
    }
    // if (!this.props.user.stripe_id || !this.props.user.subscription) {
    //   toast.error("The user does not have a stripe id or does not have a subscription");
    // }
    axios.post(`/admin-api/refund/${this.props.user.creator_id}`)
      .then(res => {
        toast.success("Refu");
      })
      .catch(err => {
        toast.error('Refund unsuccessful');
      })
  };

  cancelSubscription = () => {
    if (!this.props.user.creator_id) {
      toast.error("No user id entered");
    }
    axios.post(`/admin-api/cancel/${this.props.user.creator_id}`)
      .then(res => {
        toast.success("Refund successful!");
      })
      .catch(err => {
        toast.error('Refund unsuccessful');
      })
  };

  render() {
    if (!this.props.user)
      return null;
    return (
      <div className="user_card_wrapper">

        <div className="user_card_card">
          <div className="additional">
            <div className="user-card">
              <div className="level user_card_center">
                Id: {this.props.user.creator_id}
              </div>
              <div className="points user_card_center">
                Admin level: {this.props.user.admin}
              </div>
              <User user={this.props.user} className="user_card_center user_logo"/>
            </div>
          </div>
          <div className="user_card_general">
            <div className="user_card_name">{this.props.user.name}</div>
            <div className="user_date_joined">
              {moment(this.props.user.created).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            <p>
              {this.props.user.email}
            </p>
            <p>
              {this.props.user.subscription ? this.props.user.subscription : 'No subscription active'}
            </p>
            <p>
              {this.props.user.strip_id ? this.props.user.strip_id : 'No Stripe Id'}
            </p>
            <p>
              Google ID: {this.props.user.gid ? this.props.user.gid : 'no google ID'}
            </p>
            <div className="advanced_button_row">
              <AdminAdvancedModal
                showModal={true}
                buttonLabel={'Advanced'}
                user={this.props.user}
                cancelSubscription={() => this.cancelSubscription()}
                refundUser={this.refundUser}
              />
            </div>
            {/*<span className="more">Mouse over the card for metadata</span>*/}
          </div>
        </div>

      </div>
    )
  }
};

export default UserCard;
