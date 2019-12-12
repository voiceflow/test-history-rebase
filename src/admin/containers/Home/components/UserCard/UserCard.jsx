import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import User from '../User';
import { Card, Footer, LeftPanel, LeftPanelText, RightPanel, RightPanelHeader, RightPanelText, UserCardWrapper, linkStyles } from './components';

class UserCard extends React.Component {
  render() {
    if (!this.props.creator) return null;
    return (
      <UserCardWrapper>
        <Card>
          <LeftPanel>
            <LeftPanelText>Id: {this.props.creator.creator_id}</LeftPanelText>
            <User user={this.props.creator} />
            <LeftPanelText>Admin level: {this.props.creator.admin}</LeftPanelText>
          </LeftPanel>
          <RightPanel>
            <RightPanelHeader>{this.props.creator.name}</RightPanelHeader>
            <RightPanelText>{moment(this.props.creator.created).format('MMMM Do YYYY, h:mm:ss a')}</RightPanelText>
            <RightPanelText>{this.props.creator.email}</RightPanelText>
            <RightPanelText>{this.props.creator.subscription ? this.props.creator.subscription : 'No subscription active'}</RightPanelText>
            <RightPanelText>{this.props.creator.strip_id ? this.props.creator.strip_id : 'No Stripe Id'}</RightPanelText>
            <RightPanelText>Google ID: {this.props.creator.gid ? this.props.creator.gid : 'no google ID'}</RightPanelText>
            <Footer>
              <Link to={`/admin/charges/${this.props.creator.creator_id ? this.props.creator.creator_id : null}`} styles={linkStyles}>
                View Charges & Subscription
              </Link>
            </Footer>
          </RightPanel>
        </Card>
      </UserCardWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.creator,
});

export default connect(mapStateToProps)(UserCard);
