import './ActionGroup.css';

import React from 'react';
import { connect } from 'react-redux';

import Alexa from './AlexaV2';
// import GoogleActionGroup from './Google';

function ActionGroup({ platform }) {
  return <Alexa />;
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
});

export default connect(mapStateToProps)(ActionGroup);
