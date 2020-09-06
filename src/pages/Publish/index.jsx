import './Skill.css';

import React from 'react';
import { NavLink, Switch } from 'react-router-dom';

import PrivateRoute from '@/Routes/PrivateRoute';
import Flex from '@/components/Flex';
import { FeatureFlag } from '@/config/features';
import { PublishRoute } from '@/config/routes';
import { PlatformType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import PublishAmazon from './Amazon';
import Export from './Export';
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
    display: () => <Flex>Amazon Alexa</Flex>,
    link: `/${PublishRoute.ALEXA}`,
    exact: true,
  },
  {
    // eslint-disable-next-line react/display-name
    display: () => <Flex>Google Assistant</Flex>,
    link: `/${PublishRoute.GOOGLE}`,
  },
];

const CODE_EXPORT_TAB = {
  // eslint-disable-next-line react/display-name
  display: () => <Flex>Code Export</Flex>,
  link: `/${PublishRoute.EXPORT}`,
};

function Publish(props) {
  const {
    match: { path },
    history,
    skillID,
    location,
    platform,
    ...ownProps
  } = props;

  const codeExport = useFeature(FeatureFlag.CODE_EXPORT);
  let tabOptions = TABS;

  if (codeExport.isEnabled && platform === PlatformType.ALEXA) {
    tabOptions = [...tabOptions, CODE_EXPORT_TAB];
  }

  return (
    <LockedResourceOverlay type={Realtime.ResourceType.PUBLISH}>
      {({ lockOwner, prevOwner, forceUpdateKey }) => (
        <Container>
          <Sidebar>
            {tabOptions.map((tab, i) => (
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
                path={`${path}/${PublishRoute.ALEXA}`}
                skillID={skillID}
                component={PublishAmazon}
                isLocked={!!lockOwner || !!prevOwner}
              />
              <PrivateRoute
                {...ownProps}
                key={forceUpdateKey}
                path={`${path}/${PublishRoute.GOOGLE}`}
                skillID={skillID}
                component={PublishGoogle}
                isLocked={!!lockOwner || !!prevOwner}
              />
              <PrivateRoute
                {...ownProps}
                key={forceUpdateKey}
                path={`${path}/${PublishRoute.EXPORT}`}
                skillID={skillID}
                component={Export}
                isLocked={false}
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
