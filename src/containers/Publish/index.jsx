import './Skill.css';

import React from 'react';
import { NavLink, Switch } from 'react-router-dom';
import { Badge } from 'reactstrap';

import PrivateRoute from '@/Routes/PrivateRoute';
import { userSelector } from '@/ducks/account';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
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
        <i className="fab fa-amazon mr-2" /> Alexa
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
        <i className="fab fa-google mr-2" /> Google{' '}
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
          <PrivateRoute {...ownProps} path={`${path}/alexa`} component={PublishAmazon} skillID={skillID} />
          <PrivateRoute {...ownProps} path={`${path}/google`} component={PublishGoogle} skillID={skillID} />
        </Switch>
      </div>
    </div>
  );
}

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  platform: activePlatformSelector,
};

export default connect(mapStateToProps)(Publish);
