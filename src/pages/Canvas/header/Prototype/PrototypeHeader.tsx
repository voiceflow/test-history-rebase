import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { connect, styled } from '@/hocs';

import { ShareProject } from '../ActionGroup/components';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

const TimerContainer = styled(FlexCenter)`
  position: absolute;
  left: 50%;
`;

const PrototypeHeader = ({ status }: { status: PrototypeStatus }) => (
  <>
    <TimerContainer>
      {status === PrototypeStatus.ENDED && (
        <>
          Completed<SeparatorDot>•</SeparatorDot>
        </>
      )}
      <PrototypeTimer />
    </TimerContainer>
    <ShareProject render />
  </>
);

const mapStateToProps = {
  status: prototypeStatusSelector,
};

export default connect(mapStateToProps)(PrototypeHeader);
