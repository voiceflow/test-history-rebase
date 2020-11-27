import React from 'react';

import { Flex } from '@/components/Box';
import { FlexCenter } from '@/components/Flex';
import { FeatureFlag } from '@/config/features';
import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

import { CanvasSettingsButton, GroupContainer, ShareProject, UploadProjectButton } from '../ActionGroup/components';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

const TimerContainer = styled(FlexCenter)`
  position: absolute;
  left: 50%;
`;

function PrototypeHeader({ status }: { status: PrototypeStatus }) {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);
  const newPrototypeHeader = prototypeTest.isEnabled || headerRedesign.isEnabled;

  return (
    <Flex style={{ height: '100%', minHeight: '100%' }}>
      <TimerContainer>
        {status === PrototypeStatus.ENDED && (
          <>
            Completed<SeparatorDot>•</SeparatorDot>
          </>
        )}
        <PrototypeTimer />
      </TimerContainer>
      {newPrototypeHeader ? (
        <ShareProject render />
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
    </Flex>
  );
}

const mapStateToProps = {
  status: prototypeStatusSelector,
};

export default connect(mapStateToProps)(PrototypeHeader);
