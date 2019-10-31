import './UserTesting.css';

import React from 'react';
import { IntercomAPI } from 'react-intercom';
import { Tooltip } from 'react-tippy';

import client from '@/client';
import RoundButton from '@/components/Button/RoundButton';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Header from '@/components/Header';
import Dropdown from '@/componentsV2/Dropdown';
import { MenuContainer } from '@/componentsV2/Menu';
import { TestingModeProvider } from '@/containers/CanvasV2/contexts';
import Testing from '@/containers/Testing';
import { replaceIntents } from '@/ducks/intent';
import { activeDiagramIDSelector, activeNameSelector, setActiveSkill } from '@/ducks/skill';
import { replaceSlots } from '@/ducks/slot';
import { initializeTest, updateTest } from '@/ducks/test';
import { connect, styled } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';

const UserTestingMenuContainer = styled(MenuContainer)`
  padding: 18px 24px;
  white-space: normal;
  margin-top: 10px;
`;

class UserTesting extends React.Component {
  state = { loading: 1 };

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

  renderBody = () => (
    <UserTestingMenuContainer>
      <FadeDownContainer>
        <div className="mb-3">
          <h6 className="text-muted">Share testable link</h6>
          <small className="text-dull">
            Anyone with this link will be able to simulate this flow from within their browser by using their voice or text input.
          </small>
        </div>
        <ClipBoard name="link" value={window.location.href} id="shareLink" />
      </FadeDownContainer>
    </UserTestingMenuContainer>
  );

  // eslint-disable-next-line class-methods-use-this
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
            <div className="mr-3">
              <Dropdown menu={this.renderBody} placement="bottom-end" selfDismiss>
                {(ref, onToggle, isOpen) => (
                  <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
                    <RoundButton variant="color" color="#5b9dfa" active={isOpen} size={44} icon="share" onClick={onToggle} imgSize={15} ref={ref} />
                  </Tooltip>
                )}
              </Dropdown>
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
