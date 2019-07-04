import './UserTesting.css';

import axios from 'axios';
import Button from 'components/Button';
import ClipBoard from 'components/ClipBoard/ClipBoard';
import Header from 'components/Header';
import Test from 'containers/Canvas/Test';
import { initializeTest, startTest, updateTest } from 'ducks/test';
import { fetchVersionSuccess } from 'ducks/version';
import _ from 'lodash';
import React from 'react';
import { IntercomAPI } from 'react-intercom';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody } from 'reactstrap';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["componentDidMount","componentWillUnmount","render"] }] */

class UserTesting extends React.Component {
  state = { loading: 1, share: false };

  componentDidMount() {
    IntercomAPI('update', {
      hide_default_launcher: true,
    });
    if (this.props.skill.diagram) {
      this.setState({ loading: 0 });
    } else {
      this.fetchInformation();
    }
  }

  componentWillUnmount() {
    IntercomAPI('update', {
      hide_default_launcher: false,
    });
  }

  async fetchInformation() {
    const { fetchVersionSuccess, initializeTest, updateTest, startTest, skill } = this.props;
    const { data: skillData } = await axios.get(`/test/getInfo/${this.props.match.params.skill_id}`);

    const globals = Array.isArray(skillData.global) ? skillData.global : [];
    skillData.global = [...new Set(['sessions', 'user_id', 'timestamp', 'platform', 'locale', ...globals])];
    if (!skillData.fulfillment) {
      skillData.fulfillment = {};
    }
    skillData.platform = skillData.platform === 'google' ? 'google' : 'alexa';

    fetchVersionSuccess(skillData, {});

    this.setState({ loading: 0 });
    initializeTest();
    updateTest({ rendered: 2 });
    startTest(skill.diagram);
  }

  toggleShare = () => {
    this.setState({
      share: !this.state.share,
    });
  };

  render() {
    return (
      <>
        <Header
          leftRenderer={() => (
            <a href="https://www.voiceflow.com" className="mx-2">
              <img className="voiceflow-logo" src="/logo.png" alt="logo" />
            </a>
          )}
          centerRenderer={() => (this.props.skill && this.props.skill.name) || 'Loading...'}
          rightRenderer={() => (
            <>
              <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
                <Button isNavBordered id="icon-link" className="fas fa-link" onClick={this.toggleShare} />
              </Tooltip>
              <Popover placement="bottom" isOpen={this.state.share} target="icon-link" toggle={this.toggleShare} className="mt-3">
                <PopoverBody style={{ minWidth: '260px' }}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <ClipBoard component="button" className="btn btn-clear copy-link" value={window.location.href} id="shareLink">
                        <i className="fas fa-copy" />
                      </ClipBoard>
                    </InputGroupAddon>
                    <Input readOnly value={window.location.href} className="form-control-border right" />
                  </InputGroup>
                </PopoverBody>
              </Popover>
            </>
          )}
        />
        {!this.state.loading && (
          <div className="PublicUserTesting">
            <Test open={true} enterFlow={_.noop} loading={this.state.loading} setSaveCB={_.noop} save={_.noop} />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  initializeTest,
  updateTest,
  startTest,
  fetchVersionSuccess,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTesting);
