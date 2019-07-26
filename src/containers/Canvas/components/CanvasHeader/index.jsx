import React from 'react';
import { connect } from 'react-redux';

import Header from '@/components/Header';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import { updateVersion } from '@/ducks/version';

import PlatformToggle from './components/PlatformToggle';
import ProjectTitle from './components/ProjectTitle';

export function CanvasHeader({ platform, history, preview, updateSkill, renderPlatformSwitch, updateLinter, children }) {
  const onToggle = () => {
    const nextPlatform = platform === 'google' ? 'alexa' : 'google';
    updateSkill('platform', nextPlatform).then(() => {
      renderPlatformSwitch();
      updateLinter();
    });
  };

  return (
    <Header
      history={history}
      preview={preview}
      onBackClick={() => history.push('/')}
      leftRenderer={() => <ProjectTitle onChange={updateSkill} />}
      centerRenderer={() => <PlatformToggle platform={platform} onToggle={onToggle} />}
      rightRenderer={() => children}
      subHeaderRenderer={() => <SecondaryNavBar page="canvas" history={history} />}
    />
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
