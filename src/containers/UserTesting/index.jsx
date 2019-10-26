import './UserTesting.css';

import React from 'react';
import { IntercomAPI } from 'react-intercom';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import client from '@/client';
import RoundButton from '@/components/Button/RoundButton';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Header from '@/components/Header';
import Popover from '@/components/Popover';
import { TestingModeProvider } from '@/containers/CanvasV2/contexts';
import Testing from '@/containers/Testing';
import { replaceIntents } from '@/ducks/intent';
import { activeDiagramIDSelector, activeNameSelector, setActiveSkill } from '@/ducks/skill';
import { replaceSlots } from '@/ducks/slot';
import { initializeTest, updateTest } from '@/ducks/test';
import { connect } from '@/hocs';
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["componentDidMount","componentWillUnmount","render"] }] */

const BodyContainer = styled.div`
  padding: 18px 24px;
  font-family: 'Open Sans';
`;

class UserTesting extends React.Component {
  state = { loading: 1, share: false };

  sharingButton = React.createRef();

  componentDidMount() {
    IntercomAPI('update', {
      hide_default_launcher: true,
    });
    if (this.props.diagramID) {
      this.setState({ loading: 0 });
    } else {
      this.fetchInformation();
    }
  }

  renderBody = () => {
    return (
      <BodyContainer>
        <div className="mb-3">
          <h6 className="text-muted">Share testable link</h6>
          <small className="text-dull">
            Anyone with this link will be able to simulate this flow from within their browser by using their voice or text input.
          </small>
        </div>
        <ClipBoard name="link" value={window.location.href} id="shareLink" />
      </BodyContainer>
    );
  };

  componentWillUnmount() {
    IntercomAPI('update', {
      hide_default_launcher: false,
    });
  }

  async fetchInformation() {
    const { setActiveSkill, initializeTest, updateTest, replaceIntents, replaceSlots } = this.props;
    const { skill, intents, slots, testVariableValues } = await client.testing.getInfo(this.props.match.params.skill_id);

    skill.globalVariables = [...new Set(['sessions', 'user_id', 'timestamp', 'platform', 'locale', ...skill.globalVariables])];
    if (!skill.fulfillment) {
      skill.fulfillment = {};
    }
    skill.platform = skill.platform === 'google' ? 'google' : 'alexa';

    setActiveSkill(skill);
    replaceIntents(intents);
    replaceSlots(slots);

    localStorage.setItem(`TEST_VARIABLES_${skill.id}`, JSON.stringify(testVariableValues));

    this.setState({ loading: 0 });
    initializeTest({ userTest: true });
    updateTest({ rendered: 2 });
  }

  toggleShare = () => {
    this.setState({
      share: !this.state.share,
    });
  };

  render() {
    const { name } = this.props;
    return (
      <>
        <a id="MadeInVoiceflow" href="https://voiceflow.com" target="_blank" rel="noopener noreferrer">
          <img src="/favicon.png" alt="Voiceflow" />
          <span>Made In Voiceflow</span>
        </a>
        <Header
          isUserMenu
          leftRenderer={() => (
            <a href="https://www.voiceflow.com" className="mx-2">
              <img className="voiceflow-logo" src="/logo_bubble_Small.png" alt="logo" />
            </a>
          )}
          centerRenderer={() => name || 'Loading...'}
          rightRenderer={() => (
            <div ref={this.sharingButton} className="mr-3">
              <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
                <RoundButton
                  variant="color"
                  color="#5b9dfa"
                  active={this.state.share}
                  size={44}
                  icon="share"
                  onClick={this.toggleShare}
                  imgSize={15}
                />
              </Tooltip>
              <Popover
                gap={-12}
                show={this.state.share}
                className="mt-3 share"
                target={this.sharingButton.current}
                onHide={this.toggleShare}
                renderBody={this.renderBody}
              />
            </div>
          )}
        />
        {!this.state.loading && (
          <div id="PublicUserTesting">
            <TestingModeProvider value={true}>
              <Testing />
            </TestingModeProvider>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = {
  name: activeNameSelector,
  diagramID: activeDiagramIDSelector,
};

const mapDispatchToProps = {
  initializeTest,
  replaceIntents,
  replaceSlots,
  updateTest,
  setActiveSkill,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTesting);
