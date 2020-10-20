import React from 'react';

import { FeatureFlag } from '@/config/features';
import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

import { CanvasSettingsButton, GroupContainer, ShareProject, UploadProjectButton } from '../ActionGroup/components';
import SharePrototypeButton from '../ActionGroup/components/SharePrototypeButton';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

const TimerContainer = styled.div`
  display: inline-block;
  position: absolute;
  left: 49%;
`;

function PrototypeHeader({ status }: { status: PrototypeStatus }) {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);
  return (
    <>
      <TimerContainer>
        {status === PrototypeStatus.ENDED && (
          <>
            Completed<SeparatorDot>•</SeparatorDot>
          </>
        )}
        <PrototypeTimer />
      </TimerContainer>
      {prototypeTest.isEnabled ? (
        <SharePrototypeButton />
      ) : (
        <>
          <GroupContainer>
            <ResourcesHeaderButton hasShortcuts />
            <SubHeaderItem>
              <CanvasSettingsButton />
            </SubHeaderItem>
          </GroupContainer>
          <GroupContainer>
            <ShareProject render={false} />
          </GroupContainer>
          <UploadProjectButton />
        </>
      )}
    </>
  );
}

const mapStateToProps = {
  status: prototypeStatusSelector,
};

export default connect(mapStateToProps)(PrototypeHeader);
