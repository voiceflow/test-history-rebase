import React from 'react';

import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';
import { useCanvasMode } from '@/pages/Skill/hooks';

import { CanvasSettingsButton, GroupContainer, ShareProject, TestButton, UploadProjectGroup } from './components';

function ActionGroup(props: { platform: PlatformType }) {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const isCanvasMode = useCanvasMode();
  return (
    <>
      <GroupContainer>
        <ResourcesHeaderButton hasShortcuts />
        <SubHeaderItem>
          <CanvasSettingsButton />
        </SubHeaderItem>{' '}
      </GroupContainer>

      {headerRedesign.isEnabled && isCanvasMode ? (
        <>
          {props.platform === PlatformType.GENERAL ? (
            <UploadProjectGroup />
          ) : (
            <GroupContainer>
              <UploadProjectGroup />
            </GroupContainer>
          )}
          <GroupContainer>
            <ShareProject render />
          </GroupContainer>
          <TestButton />
        </>
      ) : (
        <>
          <GroupContainer>
            <ShareProject render />
          </GroupContainer>

          <UploadProjectGroup />
        </>
      )}
    </>
  );
}

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

export default connect(mapStateToProps)(ActionGroup);
