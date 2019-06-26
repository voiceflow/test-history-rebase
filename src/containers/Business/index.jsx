import "./Business.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import AccountLinkTemplate from "./AccountLinkTemplate";
import Home from "./Home";
import EditProduct from "./Products/EditProduct";
import Products from "./Products/Products";

const updateLink = (link, skill_id) => {
  return link.replace(":skill_id", skill_id);
};

const tabs = [
  {
    display: (
      <React.Fragment>
        <i className="far fa-tachometer-alt mr-2" /> Dashboard
      </React.Fragment>
    ),
    match: ["home"],
    link: "/tools/:skill_id"
  },
  {
    display: (
      <React.Fragment>
        <i className="far fa-cube mr-2" /> Products
      </React.Fragment>
    ),
    match: ["products"],
    link: "/tools/:skill_id/products"
  }
];

class Business extends Component {
  render() {
    let page;
    switch (this.props.page) {
      case "products":
        page = <Products {...this.props} />;
        break;
      case "product":
        page = <EditProduct {...this.props} />;
        break;
      default:
        page = <Home {...this.props} />;
    }

    return (
      <div id="business">
        <div className="business-page">{page}</div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.account,
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id
});

export default connect(mapStateToProps)(Business);
