import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import Page from '@/components/Page';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { ProjectLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import GeneralSettings from './components/GeneralSettings';
import ProjectVersions from './components/ProjectVersions';
import { PLATFORM_SETTINGS_META, Tabs } from './constants';

const Settings: React.FC<ConnectedSettings> = ({ platform, goToDesign }) => {
  const { tabs } = PLATFORM_SETTINGS_META[platform];
  const { url } = useRouteMatch();

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDesign} header={<SettingsHeader>Project Settings</SettingsHeader>}>
      <span id="vf-settings-page">
        <SettingsContainer tabs={tabs}>
          <Switch>
            <Route path={`${url}/${Tabs.GENERAL.path}`} component={GeneralSettings} />
            <Route path={`${url}/${Tabs.VERSIONS.path}`} component={ProjectVersions} />
            <Redirect from="*" to={`${url}/${Tabs.GENERAL.path}`} />
          </Switch>
        </SettingsContainer>
      </span>
    </Page>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};
type ConnectedSettings = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate([
    ProjectLoadingGate,
    ({ match }: { match: any }) => ({
      versionID: match.params?.versionID,
      diagramID: match.params?.diagramID,
    }),
  ])
)(Settings as any);
