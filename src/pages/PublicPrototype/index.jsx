import './PublicPrototype.css';

import React from 'react';
import { Tooltip } from 'react-tippy';

import client from '@/client';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import IconButton from '@/components/IconButton';
import MadeInVoiceflow from '@/components/MadeInVoiceflow';
import { MenuContainer } from '@/components/Menu';
import { replaceIntents } from '@/ducks/intent';
import { initializePrototype, updateVariables } from '@/ducks/prototype';
import { activeDiagramIDSelector, activeNameSelector, setActiveSkill } from '@/ducks/skill';
import { replaceSlots } from '@/ducks/slot';
import { connect, styled } from '@/hocs';
import Prototype from '@/pages/Prototype';
import { FadeDownDelayedContainer } from '@/styles/animations';
import * as Intercom from '@/vendors/intercom';

const PrototypeContainer = styled.div`
  position: relative;
  display: flex;
  height: calc(100% - 124px);
  padding: 16px;
`;

const PublicPrototypeMenuContainer = styled(MenuContainer)`
  margin-top: 10px;
  padding: 18px 24px;
  white-space: normal;
`;

class PublicPrototype extends React.Component {
  state = { loading: 1 };

  componentDidMount() {
    Intercom.updateSettings({ hide_default_launcher: true });
    if (this.props.diagramID) {
      this.setState({ loading: 0 });
    } else {
      this.fetchInformation();
    }
  }

  renderBody = () => (
    <PublicPrototypeMenuContainer>
      <FadeDownDelayedContainer>
        <div className="mb-3">
          <h6 className="text-muted">Share testable link</h6>
          <small className="text-dull">
            Anyone with this link will be able to simulate this flow from within their browser by using their voice or text input.
          </small>
        </div>
        <ClipBoard name="link" value={window.location.href} id="shareLink" />
      </FadeDownDelayedContainer>
    </PublicPrototypeMenuContainer>
  );

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    Intercom.updateSettings({ hide_default_launcher: false });
  }

  async fetchInformation() {
    const { setActiveSkill, initializePrototype, updateVariables, replaceIntents, replaceSlots } = this.props;
    const { skill, intents, slots, testVariableValues } = await client.prototype.getInfo(this.props.match.params.versionID);

    skill.globalVariables = [...new Set(['sessions', 'user_id', 'timestamp', 'platform', 'locale', ...skill.globalVariables])];
    skill.platform = skill.platform === 'google' ? 'google' : 'alexa';

    setActiveSkill(skill);
    replaceIntents(intents);
    replaceSlots(slots);

    localStorage.setItem(`TEST_VARIABLES_${skill.id}`, JSON.stringify(testVariableValues));

    updateVariables(testVariableValues);
    initializePrototype({ intents: [], slots: [] });
    this.setState({ loading: 0 });
  }

  render() {
    const { name } = this.props;
    return (
      <>
        <MadeInVoiceflow />
        <Header
          isUserMenu
          withLogo
          logoAssetPath="/logo_bubble_Small.png"
          centerRenderer={() => name || 'Loading...'}
          rightRenderer={() => (
            <div className="mr-3">
              <Dropdown menu={this.renderBody} placement="bottom-end" selfDismiss>
                {(ref, onToggle, isOpen) => (
                  <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
                    <IconButton variant="action" color="#5b9dfa" active={isOpen} large icon="share" onClick={onToggle} size={16} ref={ref} />
                  </Tooltip>
                )}
              </Dropdown>
            </div>
          )}
        />
        {!this.state.loading && (
          <PrototypeContainer id="PublicUserPrototype">
            <Prototype isPublic debug={false} />
          </PrototypeContainer>
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
  initializePrototype,
  updateVariables,
  replaceIntents,
  replaceSlots,
  setActiveSkill,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicPrototype);
