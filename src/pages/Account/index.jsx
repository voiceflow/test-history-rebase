import './Account.css';

import moment from 'moment';
import React, { Component } from 'react';

import Header from '@/components/Header';
import Button from '@/components/LegacyButton';
import Image from '@/components/LegacyUpload/Image';
import { checkAmazonAccount, checkGoogleAccount, deleteAmazonAccount, deleteGoogleAccount, updateAccount, userSelector } from '@/ducks/account';
import { setConfirm, setError } from '@/ducks/modal';
import { connect } from '@/hocs';

class Account extends Component {
  state = {
    amazonStatus: false,
    googleStatus: false,
  };

  componentDidMount = () => {
    const { checkAmazonAccount, checkGoogleAccount } = this.props;
    // eslint-disable-next-line promise/catch-or-return
    checkAmazonAccount().then(() => this.setState({ amazonStatus: true }));
    // eslint-disable-next-line promise/catch-or-return
    checkGoogleAccount().then(() => this.setState({ googleStatus: true }));
  };

  resetAmazon = () => {
    const { setConfirm, deleteAmazonAccount } = this.props;
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
        await deleteAmazonAccount();
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
              <Image className="icon-image large-icon mr-4" path="/user/profile/picture" image={user.image} update={this.uploadProfile} replace />
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
                <h5 className="mb-0 text-muted">Dialogflow</h5>
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
  user: userSelector,
};

const mapDispatchToProps = {
  checkAmazonAccount,
  checkGoogleAccount,
  deleteAmazonAccount,
  deleteGoogleAccount,
  setConfirm,
  setError,
  updateAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
