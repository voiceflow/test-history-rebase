import React from 'react';
import { Switch } from 'react-router-dom';

import { ToolsRoute } from '@/config/routes';
import * as Realtime from '@/ducks/realtime';
import { lazy } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import PrivateRoute from '@/Routes/PrivateRoute';

import { PageContainer } from './components';

const Product = lazy(() => import('./Product'));
const ProductsList = lazy(() => import('./ProductsList'));

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
          <PrivateRoute {...ownProps} path={`${path}/${ToolsRoute.PRODUCTS}`} component={ProductsList} />
          <PrivateRoute {...ownProps} path={`${path}/${ToolsRoute.PRODUCT}/:id`} component={Product} />
        </Switch>
      </PageContainer>
      <LockedResourceOverlay type={Realtime.ResourceType.PRODUCTS} />
    </>
  );
}

export default React.memo(Business);
