import React from 'react';
import { connect } from 'react-redux';

import IntercomChat from '@/components/Header/components/IntercomChat';
import UserMenu from '@/components/Header/components/UserMenu';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import { updateVersion } from '@/ducks/version';

import PlatformToggle from './components/PlatformToggle';
import ProjectTitle from './components/ProjectTitle';
import { CanvasHeaderContainer, HeaderActions, HeaderNavigation, JustifiedHeaderActions, PrimaryCanvasHeader } from './styled';

export function CanvasHeader({ platform, history, preview, updateSkill, renderPlatformSwitch, updateLinter, children }) {
  const onToggle = () => {
    const nextPlatform = platform === 'google' ? 'alexa' : 'google';
    updateSkill('platform', nextPlatform).then(() => {
      renderPlatformSwitch();
      updateLinter();
    });
  };

  return (
    <CanvasHeaderContainer>
      <PrimaryCanvasHeader>
        <HeaderNavigation>
          <ProjectTitle onChange={updateSkill} />
        </HeaderNavigation>
        <HeaderActions>
          <PlatformToggle platform={platform} onToggle={onToggle} />
          <JustifiedHeaderActions>
            <div className="title-group no-select">{children}</div>
            <UserMenu history={history} preview={preview} />
          </JustifiedHeaderActions>
        </HeaderActions>
      </PrimaryCanvasHeader>
      <SecondaryNavBar page="canvas" history={history} />
      <IntercomChat />
    </CanvasHeaderContainer>
  );
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
});

const mapDispatchToProps = {
  updateSkill: updateVersion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasHeader);
