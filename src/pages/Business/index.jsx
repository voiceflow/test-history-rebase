import './Business.css';

import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from '@/Routes/PrivateRoute';
import { userSelector } from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import { activeProjectIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

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
    <>
      <div id="business">
        <div className="business-page">
          <Switch>
            <PrivateRoute {...ownProps} exact path={path} component={Home} />
            <PrivateRoute {...ownProps} path={`${path}/products`} component={ProductsList} />
            <PrivateRoute {...ownProps} path={`${path}/product/:id`} component={Product} />
          </Switch>
        </div>
      </div>
      <LockedResourceOverlay type={Realtime.ResourceType.PRODUCTS} />
    </>
  );
}

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  projectID: activeProjectIDSelector,
};

export default connect(mapStateToProps)(Business);
