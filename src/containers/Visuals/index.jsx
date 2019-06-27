import React, { Component } from 'react';
import { connect } from 'react-redux';

import Display from './Display';
import Multimodal from './Multimodal';

class Business extends Component {
  render() {
    let page;

    if (this.props.page === 'display') {
      page = <Display {...this.props} />;
    } else {
      page = <Multimodal {...this.props} />;
    }

    return (
      <div id="business">
        <div className="business-page">{page}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_kd,
});
export default connect(mapStateToProps)(Business);
