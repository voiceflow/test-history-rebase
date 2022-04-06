import React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { lazy } from '@/hocs';
import PrivateRoute from '@/Routes/PrivateRoute';

import { PageContainer } from './components';

const EditProduct = lazy(() => import('./EditProduct'));
const NewProduct = lazy(() => import('./NewProduct'));
const ProductsList = lazy(() => import('./ProductsList'));

const Business: React.FC<RouteComponentProps> = () => (
  <>
    <PageContainer>
      <Switch>
        <PrivateRoute exact path={Path.PRODUCT_LIST} component={ProductsList} />
        <PrivateRoute exact path={Path.NEW_PRODUCT} component={NewProduct} />
        <PrivateRoute path={Path.PRODUCT_DETAILS} component={EditProduct} />
      </Switch>
    </PageContainer>
  </>
);

export default React.memo(Business);
