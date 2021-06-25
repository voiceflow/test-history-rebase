import './Skill.css';

import { Flex } from '@voiceflow/ui';
import React from 'react';
import { NavLink, Redirect, RouteComponentProps, Switch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { PublishRoute } from '@/config/routes';
import { PlatformType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import { connect, lazy } from '@/hocs';
import { usePermission } from '@/hooks';
import PrivateRoute from '@/Routes/PrivateRoute';
import { ConnectedProps } from '@/types';
import { createPlatformSelector } from '@/utils/platform';

import Container from './components/PublishContainer';
import PlatformContainer from './components/PublishPlatformContainer';
import Sidebar from './components/PublishSidebar';
import SidebarItem from './components/PublishSidebarItem';

const PublishAmazon = lazy(() => import('./Amazon'));
const PublishGoogle = lazy(() => import('./Google'));
const Export = lazy(() => import('./Export'));
const API = lazy(() => import('./API'));

const updateLink = (link: string, versionID: string) => link.replace(':versionID', versionID);

interface Tab {
  render: () => JSX.Element;
  link: string;
  exact?: boolean;
}

const APITab: Tab = {
  render: () => <Flex>API</Flex>,
  link: `/${PublishRoute.API}`,
};

const getTabs = createPlatformSelector<Tab[]>(
  {
    [PlatformType.ALEXA]: [
      {
        render: () => <Flex>Amazon Alexa</Flex>,
        link: `/${PublishRoute.ALEXA}`,
        exact: true,
      },
    ],
    [PlatformType.GOOGLE]: [
      {
        render: () => <Flex>Google Assistant</Flex>,
        link: `/${PublishRoute.GOOGLE}`,
      },
    ],
  },
  []
);

const CODE_EXPORT_TAB = {
  render: () => <Flex>Code Export</Flex>,
  link: `/${PublishRoute.EXPORT}`,
};

type PublishProps = RouteComponentProps;

const Publish: React.FC<PublishProps & ConnectedPublishProps> = ({ match: { path }, history, versionID, location, platform, ...props }) => {
  const [codeExport] = usePermission(Permission.CODE_EXPORT);

  const tabOptions = [...getTabs(platform), APITab];

  if (codeExport) {
    tabOptions.push(CODE_EXPORT_TAB);
  }

  return (
    <Container>
      <Sidebar>
        {tabOptions.map((tab, index) => (
          <SidebarItem key={index} as={NavLink} to={updateLink(`${path}${tab.link}`, versionID!)} exact={tab.exact} activeClassName="active">
            {tab.render()}
          </SidebarItem>
        ))}
      </Sidebar>

      <PlatformContainer>
        <Switch>
          <PrivateRoute {...props} path={`${path}/${PublishRoute.ALEXA}`} component={PublishAmazon} />
          <PrivateRoute {...props} path={`${path}/${PublishRoute.GOOGLE}`} component={PublishGoogle} />
          <PrivateRoute {...props} path={`${path}/${PublishRoute.EXPORT}`} component={Export} />
          <PrivateRoute {...props} path={`${path}/${PublishRoute.API}`} component={API} />
          <Redirect from={`${path}/${PublishRoute.GENERAL}`} to={`${path}/${PublishRoute.API}`} />
        </Switch>
      </PlatformContainer>
    </Container>
  );
};

const mapStateToProps = {
  user: Account.userSelector,
  platform: Project.activePlatformSelector,
  versionID: Session.activeVersionIDSelector,
};

type ConnectedPublishProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Publish);
