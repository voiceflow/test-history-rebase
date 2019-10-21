import React from 'react';

import Button from '@/componentsV2/Button';
import ShareTest from '@/containers/Testing/ShareTest';
import { goToCurrentCanvas } from '@/ducks/router';
import { TEST_STATUS, testStatusSelector } from '@/ducks/test';
import { connect } from '@/hocs';

import { SubTitleGroup } from '../ActionGroup/styled';
import TestTimer from './TestingTimer';
import { SeparatorDot } from './styled';

function TestingHeader({ goToCurrentCanvas, status }) {
  return (
    <>
      <div className="mr-5">
        {status === TEST_STATUS.ENDED && (
          <>
            Completed<SeparatorDot>•</SeparatorDot>
          </>
        )}
        <TestTimer />
      </div>
      <SubTitleGroup>
        <ShareTest />
      </SubTitleGroup>
      <Button variant="secondary" onClick={goToCurrentCanvas}>
        Return to Canvas
      </Button>
    </>
  );
}

const mapStateToProps = {
  status: testStatusSelector,
};

const mapDispatchToProps = {
  goToCurrentCanvas,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
