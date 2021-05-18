import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import Page from '@/components/Page';
import { SettingsContainer, SettingsHeader } from '@/components/Settings';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { ProjectLoadingGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import GeneralSettings from './components/GeneralSettings';
import ProjectVersions from './components/ProjectVersions';
import { getSettingsMetaProps, Tabs } from './constants';

const Settings: React.FC<ConnectedSettingsProps> = ({ platform, goToDesign }) => {
  const { tabs } = getSettingsMetaProps(platform);
  const { url } = useRouteMatch();

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDesign} header={<SettingsHeader>Project Settings</SettingsHeader>}>
      <span id={Identifier.SETTINGS_PAGE}>
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
  platform: Project.activePlatformSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
};

type ConnectedSettingsProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate(WorkspaceFeatureLoadingGate, [
    ProjectLoadingGate,
    ({ match }: { match: any }) => ({
      versionID: match.params?.versionID,
      diagramID: match.params?.diagramID,
    }),
  ])
)(Settings as any);
