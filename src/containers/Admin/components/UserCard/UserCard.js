import './UserCard.css';

import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { User } from '@/components/User/User';

class UserCard extends React.Component {
  render() {
    if (!this.props.creator) return null;
    return (
      <div className="user_card_wrapper">
        <div className="user_card_card">
          <div className="additional">
            <div className="user-card">
              <div className="level user_card_center">Id: {this.props.creator.creator_id}</div>
              <div className="points user_card_center">Admin level: {this.props.creator.admin}</div>
              <User user={this.props.creator} className="user_card_center user_logo" />
            </div>
          </div>
          <div className="user_card_general">
            <div className="user_card_name">{this.props.creator.name}</div>
            <div className="user_date_joined">{moment(this.props.creator.created).format('MMMM Do YYYY, h:mm:ss a')}</div>
            <p>{this.props.creator.email}</p>
            <p>{this.props.creator.subscription ? this.props.creator.subscription : 'No subscription active'}</p>
            <p>{this.props.creator.strip_id ? this.props.creator.strip_id : 'No Stripe Id'}</p>
            <p>Google ID: {this.props.creator.gid ? this.props.creator.gid : 'no google ID'}</p>
            <div className="advanced_button_row">
              <Link to={`/admin/charges/${this.props.creator.creator_id ? this.props.creator.creator_id : null}`} className="view_charges_link">
                View Charges & Subscription
              </Link>
              <Button onClick={() => axios.post(`/admin-api/force_refresh/${this.props.creator.creator_id}`)}> Force Refresh User</Button>
              {/* <AdminAdvancedModal */}
              {/*  showModal={false} */}
              {/*  buttonLabel={'Advanced'} */}
              {/*  cancelSubscription={() => this.cancelSubscription()} */}
              {/*  refundUser={this.refundUser} */}
              {/* /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.creator,
});

export default connect(mapStateToProps)(UserCard);
