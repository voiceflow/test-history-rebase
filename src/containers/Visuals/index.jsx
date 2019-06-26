import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Display from "./Display";
import Multimodal from "./Multimodal";

const updateLink = (link, skill_id) => {
  return link.replace(":skill_id", skill_id);
};

const tabs = [
  {
    display: (
      <React.Fragment>
        <i className="far fa-image" /> Multimodal
      </React.Fragment>
    ),
    match: ["multimodal", "displays"],
    link: "/visuals/:skill_id"
  }
];

class Business extends Component {
  render() {
    let page;

    if (this.props.page === "display") {
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

const mapStateToProps = state => ({
  skill_id: state.skills.skill.skill_kd
});
export default connect(mapStateToProps)(Business);
