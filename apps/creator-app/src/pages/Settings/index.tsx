import { Box, Header, Scroll, SecondaryNavigation } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { AssistantLayout } from '@/components/Assistant/AssistantLayout/AssistantLayout.component';
import { Path } from '@/config/routes';
import { Project } from '@/ducks';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';
import { Identifier } from '@/styles/constants';

import Backups from './Backups';
import GeneralSettings from './components/GeneralSettings';
import ProjectEnvironments from './components/ProjectEnvironments';

const Settings: React.FC = () => {
  const width = 958;
  const padding = 32;
  const maxWidth = width + 2 * padding;

  const location = useLocation();
  const onLinkClick = useOnLinkClick();

  const name = useSelector(Project.active.nameSelector);
  const hasProject = useSelector(Project.active.hasSelector);

  return (
    <AssistantLayout>
      <Box height="100%" overflow="hidden">
        <Box height="100%" style={{ flexShrink: 0 }}>
          <SecondaryNavigation title={hasProject ? name ?? '' : 'Loading...'}>
            <SecondaryNavigation.Section title="Settings" isCollapsible={false}>
              <SecondaryNavigation.Item
                icon="Settings"
                label="General"
                onClick={onLinkClick(Path.PROJECT_SETTINGS_GENERAL)}
                isActive={!!matchPath(location.pathname, Path.PROJECT_SETTINGS_GENERAL)}
              />

              <SecondaryNavigation.Item
                icon="Branch"
                label="Environments"
                onClick={onLinkClick(Path.PROJECT_SETTINGS_ENVIRONMENT)}
                isActive={!!matchPath(location.pathname, Path.PROJECT_SETTINGS_ENVIRONMENT)}
              />

              <SecondaryNavigation.Item
                icon="Versions"
                label="Backups"
                onClick={onLinkClick(Path.PROJECT_SETTINGS_BACKUP)}
                isActive={!!matchPath(location.pathname, Path.PROJECT_SETTINGS_BACKUP)}
              />
            </SecondaryNavigation.Section>
          </SecondaryNavigation>
        </Box>

        <Box direction="column" width="100%">
          <Header variant="search" style={{ flexShrink: 0 }}>
            <Header.Section.Left></Header.Section.Left>
          </Header>

          <Scroll width="100%">
            <Box id={Identifier.SETTINGS_PAGE} maxWidth={maxWidth} px={padding} py={padding}>
              <Switch>
                <Route path={Path.PROJECT_SETTINGS_GENERAL} component={GeneralSettings} />
                <Route path={Path.PROJECT_SETTINGS_BACKUP} component={Backups} />
                <Route path={Path.PROJECT_SETTINGS_ENVIRONMENT} component={ProjectEnvironments} />

                <Redirect to={{ state: location.state, pathname: Path.PROJECT_SETTINGS_GENERAL }} />
              </Switch>
            </Box>
          </Scroll>
        </Box>
      </Box>
    </AssistantLayout>
  );
};

export default Settings;
