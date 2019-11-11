import './Business.css';

import React from 'react';

import PrivateRoute from '@/Routes/PrivateRoute';
import { userSelector } from '@/ducks/account';
import { activeProjectIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import Home from './Home';
import Product from './Product';
import ProductsList from './ProductsList';

function Business(props) {
  const {
    match: { path },
    history,
    location,
    ...ownProps
  } = props;

  return (
    <div id="business">
      <div className="business-page">
        <PrivateRoute {...ownProps} exact path={path} component={Home} />
        <PrivateRoute {...ownProps} path={`${path}/products`} component={ProductsList} />
        <PrivateRoute {...ownProps} path={`${path}/product/:id`} component={Product} />
      </div>
    </div>
  );
}

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  projectID: activeProjectIDSelector,
};

export default connect(mapStateToProps)(Business);
