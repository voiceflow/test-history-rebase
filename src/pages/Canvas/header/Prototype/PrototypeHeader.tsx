import React from 'react';

import { Flex } from '@/components/Box';
import { FlexCenter } from '@/components/Flex';
import { FeatureFlag } from '@/config/features';
import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { ResourcesHeaderButton, SubHeaderItem } from '@/pages/Dashboard/Header/components';

import { CanvasSettingsButton, GroupContainer, ShareProject, UploadProjectButton } from '../ActionGroup/components';
import SharePrototypeButton from '../ActionGroup/components/SharePrototypeButton';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

const TimerContainer = styled(FlexCenter)`
  position: absolute;
  left: 50%;
`;

function PrototypeHeader({ status }: { status: PrototypeStatus }) {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);
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
    </Flex>
  );
}

const mapStateToProps = {
  status: prototypeStatusSelector,
};

export default connect(mapStateToProps)(PrototypeHeader);
