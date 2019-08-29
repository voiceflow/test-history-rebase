import './ActionGroup.css';

import React from 'react';
import { connect } from 'react-redux';

import Alexa from './Alexa';
import Google from './Google';

function ActionGroup({ platform }) {
  if (platform === 'alexa') return <Alexa />;
  return <Google />;
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
});

export default connect(mapStateToProps)(ActionGroup);
