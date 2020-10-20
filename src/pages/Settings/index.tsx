import React from 'react';

import Page from '@/components/Page';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { ProjectLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { SettingsTabsType } from '@/pages/Settings/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import { InnerContainer, LeftSection, RightSection } from './components';
import SettingsContent from './components/SettingsContent';
import SettingsHeader from './components/SettingsHeader';
import SettingsTabs from './components/SettingsTabs';

const Settings: React.FC<ConnectedSettings> = ({ platform, goToDesign }) => {
  const [selectedTab, setSelectedTab] = React.useState(SettingsTabsType.GENERAL);

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDesign} headerChildren={<SettingsHeader />}>
      <span id="vf-settings-page">
        <InnerContainer>
          <LeftSection>
            <SettingsTabs setSelectedTab={setSelectedTab} platform={platform} selectedTab={selectedTab} />
          </LeftSection>
          <RightSection>
            <FadeLeftContainer>
              <SettingsContent selectedTab={selectedTab} platform={platform} />
            </FadeLeftContainer>
          </RightSection>
        </InnerContainer>
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
