import './Business.css';

import React, { Component } from 'react';

import { userSelector } from '@/ducks/account';
import { activeProjectIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import Home from './Home';
import Product from './Product';
import ProductsList from './ProductsList';

class Business extends Component {
  render() {
    let page;
    switch (this.props.page) {
      case 'products':
        page = <ProductsList {...this.props} />;
        break;
      case 'product':
        page = <Product {...this.props} />;
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

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  projectID: activeProjectIDSelector,
};

export default connect(mapStateToProps)(Business);
