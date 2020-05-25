import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { PrototypeStatus, prototypeStatusSelector } from '@/ducks/prototype';
import { goToCurrentCanvas } from '@/ducks/router';
import { connect } from '@/hocs';
import ShareProject from '@/pages/Canvas/header/ActionGroup/ShareProject';

import { SubTitleGroup } from '../ActionGroup/styled';
import PrototypeTimer from './PrototypeTimer';
import { SeparatorDot } from './styled';

function PrototypeHeader({ goToCurrentCanvas, status }) {
  return (
    <>
      <div className="mr-5">
        {status === PrototypeStatus.ENDED && (
          <>
            Completed<SeparatorDot>•</SeparatorDot>
          </>
        )}
        <PrototypeTimer />
      </div>
      <SubTitleGroup>
        <ShareProject />
      </SubTitleGroup>
      <Button icon="exitFullscreen" variant={ButtonVariant.SECONDARY} onClick={goToCurrentCanvas}>
        Return to Canvas
      </Button>
    </>
  );
}

const mapStateToProps = {
  status: prototypeStatusSelector,
};

const mapDispatchToProps = {
  goToCurrentCanvas,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeHeader);
