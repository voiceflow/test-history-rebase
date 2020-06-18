import React from 'react';

import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { connect, styled } from '@/hocs';
import ShareProject from '@/pages/Canvas/header/ActionGroup/ShareProject';
import UploadProjectButton from '@/pages/Canvas/header/ActionGroup/components/UploadProjectButton';
import { SubHeaderItem } from '@/pages/Dashboard/Header/components';
import ResourcesHeaderButton from '@/pages/Dashboard/Header/components/ResourcesHeaderButton';

import CanvasSettingsButton from '../ActionGroup/components/CanvasSettingsButton';
import { GroupContainer } from '../ActionGroup/styled';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

const TimerContainer = styled.div`
  display: flex;
  flex: 2;
  padding-left: 10px;
  padding-right: 24px;
`;

function PrototypeHeader({ status }: { status: PrototypeStatus }) {
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
  );
}

const mapStateToProps = {
  status: prototypeStatusSelector,
};

export default connect(mapStateToProps)(PrototypeHeader);
