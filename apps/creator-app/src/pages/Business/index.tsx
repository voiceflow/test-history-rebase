import React from 'react';
import { Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { lazy } from '@/hocs/lazy';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import PrivateRoute from '@/Routes/PrivateRoute';

import { PageContainer } from './components';

const NewProduct = lazy(() => import('./NewProduct'));
const EditProduct = lazy(() => import('./EditProduct'));
const ProductsList = lazy(() => import('./ProductsList'));

const Business: React.FC = () => (
  <ProjectPage>
    <PageContainer>
      <Switch>
        <PrivateRoute exact path={Path.PRODUCT_LIST} component={ProductsList} />
        <PrivateRoute exact path={Path.NEW_PRODUCT} component={NewProduct} />
        <PrivateRoute path={Path.PRODUCT_DETAILS} component={EditProduct} />
      </Switch>
    </PageContainer>
  </ProjectPage>
);

export default React.memo(Business);
