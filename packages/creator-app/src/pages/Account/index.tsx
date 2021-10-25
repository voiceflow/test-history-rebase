import './Account.css';

import { Button, ButtonVariant } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React, { Component } from 'react';

import { UserMenu } from '@/components/Header/components';
import Page from '@/components/Page';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const UploadJustIconComponent = UploadJustIcon as React.FC<any>;

interface AccountPageState {
  amazonStatus: boolean;
  googleStatus: boolean;
}

class AccountPage extends Component<ConnectedAccountPageProps, AccountPageState> {
  state = {
    amazonStatus: false,
    googleStatus: false,
  };

  componentDidMount = () => {
    const { loadAmazonAccount, loadGoogleAccount } = this.props;
    // eslint-disable-next-line promise/catch-or-return
    loadAmazonAccount().then(() => this.setState({ amazonStatus: true }));
    // eslint-disable-next-line promise/catch-or-return
    loadGoogleAccount().then(() => this.setState({ googleStatus: true }));
  };

  resetAmazon = () => {
    const { setConfirm, unlinkAmazonAccount } = this.props;
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
        await unlinkAmazonAccount();
        this.setState({ amazonStatus: true });
      },
    });
  };

  resetGoogle = () => {
    const { setConfirm, unlinkGoogleAccount } = this.props;
    setConfirm({
      text: (
        <>Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing</>
      ),
      warning: true,
      confirm: async () => {
        this.setState({ googleStatus: false });
        await unlinkGoogleAccount();
        this.setState({ googleStatus: true });
      },
    });
  };

  amazonButton = () => {
    if (!this.state.amazonStatus) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          loading...
        </Button>
      );
    }
    if (!this.props.user.amazon) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          Unlinked
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} onClick={this.resetAmazon}>
        Reset
      </Button>
    );
  };

  googleButton = () => {
    if (!this.state.googleStatus) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          loading...
        </Button>
      );
    }
    if (!this.props.user.google) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          Unlinked
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} onClick={this.resetGoogle}>
        Reset
      </Button>
    );
  };

  render() {
    const {
      user,
      user: { amazon, google },
      goToDashboard,
    } = this.props;
    return (
      <Page navigateBackText="Back" onNavigateBack={goToDashboard} headerChildren={<UserMenu />}>
        <div id="app" className="pt-6">
          <div className="container my-5 pt-4">
            <label className="dark mb-3">Profile</label>
            <div className="mb-5 card d-flex flex-row p-4">
              <UploadJustIconComponent image={user.image} update={this.props.saveProfilePicture} size="xlarge" className="mr-3" />
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
                  {dayjs(user.created).format('MMMM Do, YYYY')}
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
                <h5 className="mb-0 text-muted">Google</h5>
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
      </Page>
    );
  }
}

const mapStateToProps = {
  user: Account.userSelector,
  isFeatureEnabled: Feature.isFeatureEnabledSelector,
};

const mapDispatchToProps = {
  loadAmazonAccount: Account.amazon.loadAccount,
  loadGoogleAccount: Account.google.loadAccount,
  unlinkAmazonAccount: Account.amazon.unlinkAccount,
  unlinkGoogleAccount: Account.google.unlinkAccount,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  saveProfilePicture: Account.saveProfilePicture,
  goToDashboard: Router.goToDashboard,
};

type ConnectedAccountPageProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage as any) as React.FC;
