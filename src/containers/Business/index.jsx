import './Business.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Home from './Home';
import EditProduct from './Products/EditProduct';
import Products from './Products/Products';

class Business extends Component {
  render() {
    let page;
    switch (this.props.page) {
      case 'products':
        page = <Products {...this.props} />;
        break;
      case 'product':
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
const mapStateToProps = (state) => ({
  user: state.account,
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id,
});

export default connect(mapStateToProps)(Business);
