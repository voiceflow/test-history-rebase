import React from 'react';

import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import { connect } from '@/hocs';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';
import { useCanvasMode } from '@/pages/Skill/hooks';

import { CanvasSettingsButton, GroupContainer, ShareProject, TestButton, UploadProjectGroup } from './components';

function ActionGroup(props: { platform: PlatformType }) {
  const isCanvasMode = useCanvasMode();

  return (
    <>
      <GroupContainer>
        <ResourcesHeaderButton hasShortcuts />
        <SubHeaderItem>
          <CanvasSettingsButton />
        </SubHeaderItem>{' '}
      </GroupContainer>

      {isCanvasMode ? (
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
  platform: Project.activePlatformSelector,
};

export default connect(mapStateToProps)(ActionGroup);
