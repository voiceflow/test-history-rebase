import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from '@/Routes/PrivateRoute';
import { userSelector } from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import { activeProjectIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import Product from './Product';
import ProductsList from './ProductsList';
import { PageContainer } from './components';

function Business(props) {
  const {
    match: { path },
    history,
    location,
    ...ownProps
  } = props;

  return (
    <>
      <PageContainer>
        <Switch>
          <PrivateRoute {...ownProps} path={`${path}/products`} component={ProductsList} />
          <PrivateRoute {...ownProps} path={`${path}/product/:id`} component={Product} />
        </Switch>
      </PageContainer>
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
