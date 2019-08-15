import React from 'react';
import { connect } from 'react-redux';

import AlexaActionGroup from './Alexa';
import GoogleActionGroup from './Google';

function ActionGroup({ platform, ...props }) {
  return platform === 'google' ? <GoogleActionGroup {...props} platform={platform} /> : <AlexaActionGroup {...props} platform={platform} />;
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
});

export default connect(mapStateToProps)(ActionGroup);
