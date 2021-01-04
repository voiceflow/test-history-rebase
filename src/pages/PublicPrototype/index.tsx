import './PublicPrototype.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tooltip } from 'react-tippy';

import client from '@/client';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { RemoveIntercom } from '@/components/IntercomChat';
import MadeInVoiceflow from '@/components/MadeInVoiceflow';
import { MenuContainer } from '@/components/Menu';
import * as Intent from '@/ducks/intent';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect, styled } from '@/hocs';
import Prototype from '@/pages/Prototype';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

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

class PublicPrototype extends React.Component<RouteComponentProps<{ versionID: string }> & ConnectedPublicPrototypeProps> {
  state = { loading: 1 };

  componentDidMount() {
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

  async fetchInformation() {
    const { setActiveSkill, initializePrototype, updateVariables, replaceIntents, replaceSlots } = this.props;
    const { skill, intents, slots, testVariableValues } = await client.prototype.getInfo(this.props.match.params.versionID);

    skill.globalVariables = [...new Set(['sessions', 'user_id', 'timestamp', 'platform', 'locale', ...skill.globalVariables])];

    setActiveSkill(skill, this.props.diagramID);
    replaceIntents(intents);
    replaceSlots(slots);

    localStorage.setItem(`TEST_VARIABLES_${skill.id}`, JSON.stringify(testVariableValues));

    updateVariables(testVariableValues);
    initializePrototype();
    this.setState({ loading: 0 });
  }

  render() {
    const { name } = this.props;
    return (
      <>
        <MadeInVoiceflow />
        <Header
          withUserMenu={false}
          withLogo
          disableLogoClick
          centerRenderer={() => name || 'Loading...'}
          rightRenderer={() => (
            <div className="mr-3">
              <Dropdown menu={this.renderBody} placement="bottom-end" selfDismiss>
                {(ref, onToggle, isOpen) => (
                  <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
                    <IconButton variant={IconButtonVariant.ACTION} active={isOpen} large icon="share" onClick={onToggle} size={16} ref={ref} />
                  </Tooltip>
                )}
              </Dropdown>
            </div>
          )}
        />
        <RemoveIntercom />
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
  name: Skill.activeNameSelector,
  diagramID: Skill.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  initializePrototype: PrototypeDuck.initializePrototype,
  updateVariables: PrototypeDuck.updateVariables,
  replaceIntents: Intent.replaceIntents,
  replaceSlots: Slot.replaceSlots,
  setActiveSkill: Skill.setActiveSkill,
};

type ConnectedPublicPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PublicPrototype as any);
