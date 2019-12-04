import './Skill.css';

import React from 'react';
import { NavLink, Switch } from 'react-router-dom';
import { Badge } from 'reactstrap';

import PrivateRoute from '@/Routes/PrivateRoute';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';

import PublishAmazon from './Amazon';
import PublishGoogle from './Google';
import Sidebar from './components/PublishSidebar';
import SidebarItem from './components/PublishSidebarItem';

const updateLink = (link, versionID) => {
  return link.replace(':versionID', versionID);
};

const TABS = [
  {
    // eslint-disable-next-line react/display-name
    display: () => (
      <>
        <i className="fab fa-amazon mr-2" />
        Alexa
      </>
    ),
    link: '/alexa',
    exact: true,
    match: ['alexa'],
  },
  {
    // eslint-disable-next-line react/display-name
    display: () => (
      <>
        <i className="fab fa-google mr-2" />
        Google
        <Badge color="primary" className="beta-badge align-middle ml-1">
          Beta
        </Badge>
      </>
    ),
    link: '/google',
    match: ['google'],
  },
];

function Publish(props) {
  const {
    match: { path },
    history,
    skillID,
    location,
    ...ownProps
  } = props;

  return (
    <LockedResourceOverlay type={Realtime.ResourceType.PUBLISH}>
      {({ lockOwner, prevOwner, forceUpdateKey }) => (
        <div id="business">
          <Sidebar md="3">
            {TABS.map((tab, i) => (
              <SidebarItem key={i} as={NavLink} to={updateLink(`${path}${tab.link}`, skillID)} exact={tab.exact} activeClassName="active">
                {tab.display(i)}
              </SidebarItem>
            ))}
          </Sidebar>

          <div md="9" className="business-page">
            <Switch>
              <PrivateRoute
                {...ownProps}
                key={forceUpdateKey}
                path={`${path}/alexa`}
                skillID={skillID}
                component={PublishAmazon}
                isLocked={!!lockOwner || !!prevOwner}
              />
              <PrivateRoute
                {...ownProps}
                key={forceUpdateKey}
                path={`${path}/google`}
                skillID={skillID}
                component={PublishGoogle}
                isLocked={!!lockOwner || !!prevOwner}
              />
            </Switch>
          </div>
        </div>
      )}
    </LockedResourceOverlay>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
  skillID: Skill.activeSkillIDSelector,
  platform: Skill.activePlatformSelector,
};

export default connect(mapStateToProps)(Publish);
