import './Account.css';

import moment from 'moment';
import React, { Component } from 'react';

import Header from '@/components/Header';
import Button from '@/components/LegacyButton';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { FeatureFlag } from '@/config/features';
import * as AccountDuck from '@/ducks/account';
import { getAmazonAccountV2, unlinkAmazonAccountV2 } from '@/ducks/account/sideEffectsV2';
import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import { connect } from '@/hocs';

class Account extends Component {
  state = {
    amazonStatus: false,
    googleStatus: false,
  };

  componentDidMount = () => {
    const { checkAmazonAccount, getAmazonAccountV2, checkGoogleAccount, isFeatureEnabled } = this.props;
    // eslint-disable-next-line promise/catch-or-return
    (isFeatureEnabled(FeatureFlag.DATA_REFACTOR) ? getAmazonAccountV2() : checkAmazonAccount()).then(() => this.setState({ amazonStatus: true }));
    // eslint-disable-next-line promise/catch-or-return
    checkGoogleAccount().then(() => this.setState({ googleStatus: true }));
  };

  resetAmazon = () => {
    const { setConfirm, isFeatureEnabled, deleteAmazonAccount, unlinkAmazonAccountV2 } = this.props;
    setConfirm({
      text: (
        <>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects/versions and can lead to live skills being deleted.
          Do not reset unless you know what you are doing
        </>
      ),
      warning: true,
      confirm: async () => {
        this.setState({ amazonStatus: false });
        await (isFeatureEnabled(FeatureFlag.DATA_REFACTOR) ? unlinkAmazonAccountV2() : deleteAmazonAccount());
        this.setState({ amazonStatus: true });
      },
    });
  };

  resetGoogle = () => {
    const { setConfirm, deleteGoogleAccount } = this.props;
    setConfirm({
      text: (
        <>Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing</>
      ),
      warning: true,
      confirm: async () => {
        this.setState({ googleStatus: false });
        await deleteGoogleAccount();
        this.setState({ googleStatus: true });
      },
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  uploadProfile = (url) => {
    this.props.updateAccount({ image: url });
  };

  amazonButton = () => {
    if (!this.state.amazonStatus) {
      return (
        <Button isPrimary disabled>
          loading...
        </Button>
      );
    }
    if (!this.props.user.amazon) {
      return (
        <Button isPrimary disabled>
          Unlinked
        </Button>
      );
    }
    return (
      <Button isPrimary onClick={this.resetAmazon}>
        Reset
      </Button>
    );
  };

  googleButton = () => {
    if (!this.state.googleStatus) {
      return (
        <Button isPrimary disabled>
          loading...
        </Button>
      );
    }
    if (!this.props.user.google) {
      return (
        <Button isPrimary disabled>
          Unlinked
        </Button>
      );
    }
    return (
      <Button isPrimary onClick={this.resetGoogle}>
        Reset
      </Button>
    );
  };

  render() {
    const {
      user,
      user: { amazon, google },
    } = this.props;
    return (
      <>
        <Header withLogo history={this.props.history} />
        <div id="app" className="pt-6">
          <div className="container my-5 pt-4">
            <label className="dark mb-3">Profile</label>
            <div className="mb-5 card d-flex flex-row p-4">
              <UploadJustIcon image={user.image} update={this.props.updateProfilePicture} size="xlarge" className="mr-3" />
              <div className="helper-text super-center border-left pl-4">
                <div className="col-0">
                  Name:
                  <br />
                  Email:
                  <br />
                  Joined:
                  <br />
                </div>
                <div className="col-sm">
                  {user.name}
                  <br />
                  {user.email}
                  <br />
                  {moment(user.created).format('MMMM Do, YYYY')}
                  <br />
                </div>
              </div>
            </div>
            <label className="dark mb-3">Developer Integrations</label>
            <div className="card mb-5">
              <div className={amazon ? 'pl-4 pr-4 pt-4 space-between' : 'p-4 space-between'}>
                <h5 className="mb-0 text-muted">Alexa Developer Console</h5>
                <div className="super-center">{this.amazonButton()}</div>
              </div>
              {amazon && (
                <>
                  <hr />
                  <div className="pl-4 pb-4 pr-4 space-between helper-text">
                    <div className="col-0">
                      Name:
                      <br />
                      Email:
                      <br />
                      User Id:
                      <br />
                    </div>
                    <div className="col-sm">
                      {amazon.profile.name}
                      <br />
                      {amazon.profile.email}
                      <br />
                      {amazon.profile.user_id}
                      <br />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="card mb-5">
              <div className="p-4 space-between">
                <h5 className="mb-0 text-muted">Google Actions</h5>
                <div className="super-center">{this.googleButton()}</div>
              </div>
              {google && google.profile && (
                <>
                  <hr />
                  <div className="pl-4 pb-4 pr-4 space-between helper-text">
                    <div className="col-0">
                      Name:
                      <br />
                      Email:
                      <br />
                      User Id:
                      <br />
                    </div>
                    <div className="col-sm">
                      {google.profile.name}
                      <br />
                      {google.profile.email}
                      <br />
                      {google.profile.id}
                      <br />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = {
  user: AccountDuck.userSelector,
  isFeatureEnabled: Feature.isFeatureEnabledSelector,
};

const mapDispatchToProps = {
  checkAmazonAccount: AccountDuck.checkAmazonAccount,
  getAmazonAccountV2,
  checkGoogleAccount: AccountDuck.checkGoogleAccount,
  deleteAmazonAccount: AccountDuck.deleteAmazonAccount,
  unlinkAmazonAccountV2,
  deleteGoogleAccount: AccountDuck.deleteGoogleAccount,
  updateAccount: AccountDuck.updateAccount,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  updateProfilePicture: Creator.updateProfilePicture,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
