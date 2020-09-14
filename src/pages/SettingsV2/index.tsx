import React from 'react';

import Page from '@/components/Page';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { ProjectLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { SettingsTabsType } from '@/pages/SettingsV2/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import { InnerContainer, LeftSection, RightSection } from './components';
import SettingsContent from './components/SettingsContent';
import Header from './components/SettingsHeader';
import SettingsTabs from './components/SettingsTabs';

const SettingsV2: React.FC<ConnectedSettingsV2> = ({ platform, goToDesign }) => {
  const [selectedTab, setSelectedTab] = React.useState(SettingsTabsType.GENERAL);

  return (
    <Page header={<Header />} userMenu={false} navigateBackText="Back" onNavigateBack={goToDesign}>
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
type ConnectedSettingsV2 = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate([
    ProjectLoadingGate,
    ({ match }: { match: any }) => ({
      versionID: match.params?.versionID,
      diagramID: match.params?.diagramID,
    }),
  ])
)(SettingsV2 as any);
