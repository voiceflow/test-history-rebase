import React from 'react';
import { Switch } from 'react-router-dom';

import { ToolsRoute } from '@/config/routes';
import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import PrivateRoute from '@/Routes/PrivateRoute';

import { PageContainer } from './components';

const Product = React.lazy(() => import('./Product'));
const ProductsList = React.lazy(() => import('./ProductsList'));

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

const mapStateToProps = {
  user: Account.userSelector,
  skillID: Skill.activeSkillIDSelector,
  projectID: Skill.activeProjectIDSelector,
};

export default connect(mapStateToProps)(Business);
