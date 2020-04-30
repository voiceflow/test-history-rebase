import './Skill.css';

import React from 'react';
import { NavLink, Switch } from 'react-router-dom';

import PrivateRoute from '@/Routes/PrivateRoute';
import Flex from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import PublishAmazon from './Amazon';
import PublishGoogle from './Google';
import Container from './components/PublishContainer';
import PlatformContainer from './components/PublishPlatformContainer';
import Sidebar from './components/PublishSidebar';
import SidebarItem from './components/PublishSidebarItem';

const updateLink = (link, versionID) => {
  return link.replace(':versionID', versionID);
};

const TABS = [
  {
    // eslint-disable-next-line react/display-name
    display: () => (
      <Flex>
        <SvgIcon icon="amazon" mr="s" />
        Alexa
      </Flex>
    ),
    link: '/alexa',
    exact: true,
    match: ['alexa'],
  },
  {
    // eslint-disable-next-line react/display-name
    display: () => (
      <Flex>
        <SvgIcon icon="google" mr="s" />
        Google
      </Flex>
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
        <Container>
          <Sidebar>
            {TABS.map((tab, i) => (
              <SidebarItem key={i} as={NavLink} to={updateLink(`${path}${tab.link}`, skillID)} exact={tab.exact} activeClassName="active">
                {tab.display(i)}
              </SidebarItem>
            ))}
          </Sidebar>

          <PlatformContainer>
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
          </PlatformContainer>
        </Container>
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
