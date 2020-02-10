import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'reactstrap';

import User from '@/admin/pages/Home/components/User';
import { findBetaCreator } from '@/admin/store/ducks/admin';
import { AdminTitle } from '@/admin/styles';
import { toast } from '@/componentsV2/Toast';

import {
  AddToBetaButton,
  BetaContentGroup,
  BetaCreator,
  BetaCreatorDetails,
  BetaDescription,
  BetaDescriptionTitle,
  BetaForm,
  BetaHelperText,
  BetaImage,
  BetaProgramDescription,
  BetaProgramWrapper,
} from './styles';

class BetaProgram extends React.Component {
  state = {
    email: '',
  };

  onUpdate = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  keyPress = (event) => {
    if (event.keyCode === 13) {
      // Search for user here
      this.props.findBetaCreator(this.state.email);
      this.setState({
        email: '',
      });
    }
  };

  onInvite = async () => {
    try {
      await axios.post('/admin-api/flags/2', {
        flags: ['beta'],
      });
      toast.success('User added to beta program');
    } catch (err) {
      toast.error('Could not add this user to beta');
    }
  };

  render() {
    const { creator } = this.props;
    return (
      <BetaProgramWrapper>
        <AdminTitle>Voiceflow Beta Software Program</AdminTitle>
        <hr />
        <BetaProgramDescription>
          <BetaImage src="/plane.svg" alt="" />
          <BetaDescriptionTitle>Voiceflow Beta Software Program</BetaDescriptionTitle>
          <BetaDescription>Select users to help make the next release of voiceflow our best yet.</BetaDescription>

          <BetaContentGroup>
            <BetaForm>
              <h5>Find a user to add to the beta program</h5>
              <div>
                <Input placeholder="Email" value={this.state.email} onChange={this.onUpdate} onKeyDown={this.keyPress} />
              </div>
              {this.state.email ? <div className="enter-text">Press enter to search</div> : <div className="spacer" />}
            </BetaForm>
            {creator.creator_id && (
              <>
                <hr />
                <BetaCreator>
                  <div>
                    <User user={this.props.creator} className="beta-user-icon" />
                    <BetaCreatorDetails>
                      <div>{creator.name}</div>
                      <div>{creator.email}</div>
                    </BetaCreatorDetails>
                  </div>
                  <AddToBetaButton variant="primary" onClick={this.onInvite}>
                    Enlist
                  </AddToBetaButton>
                </BetaCreator>
              </>
            )}
          </BetaContentGroup>
          <BetaHelperText>
            Beta users will be granted special permissions in the main application, so they can pilot all the new features voiceflow has to offer
            before everyone else.
          </BetaHelperText>
        </BetaProgramDescription>
      </BetaProgramWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  creator: state.admin.betaCreator,
});

export default connect(
  mapStateToProps,
  { findBetaCreator }
)(BetaProgram);
