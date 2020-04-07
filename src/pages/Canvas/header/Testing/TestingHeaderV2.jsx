import React from 'react';

import Button from '@/components/Button';
import { goToCurrentCanvas } from '@/ducks/router';
import { TestStatus, testingStatusSelector } from '@/ducks/testingV2';
import { connect } from '@/hocs';
import TestingShare from '@/pages/TestingV2/components/TestingShare';

import { SubTitleGroup } from '../ActionGroup/styled';
import TestTimer from './TestingTimer';
import { SeparatorDot } from './styled';

function TestingHeader({ goToCurrentCanvas, status }) {
  return (
    <>
      <div className="mr-5">
        {status === TestStatus.ENDED && (
          <>
            Completed<SeparatorDot>•</SeparatorDot>
          </>
        )}
        <TestTimer />
      </div>
      <SubTitleGroup>
        <TestingShare />
      </SubTitleGroup>
      <Button icon="exitFullscreen" variant="secondary" onClick={goToCurrentCanvas}>
        Return to Canvas
      </Button>
    </>
  );
}

const mapStateToProps = {
  status: testingStatusSelector,
};

const mapDispatchToProps = {
  goToCurrentCanvas,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestingHeader);
