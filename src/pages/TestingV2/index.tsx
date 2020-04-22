import React from 'react';

import { recentTestingSelector } from '@/ducks/recent';
import { activeLocalesSelector } from '@/ducks/skill';
import { TestStatus, resetTesting, startTesting, testingStatusSelector } from '@/ducks/testingV2';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useTrackingEvents } from '@/hooks';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';

import { Container, Dialog, Input, Reset, Start } from './components';
import { useTesting } from './hooks';
import { TMStatus } from './types';

export type TestingProps = {
  debug: boolean;
  isPublic?: boolean;
};

const Testing: React.FC<TestingProps & ConnectedTestingProps> = ({ locale, status, isPublic, startTesting, resetTesting, debug }) => {
  const [, trackEventsWrapper] = useTrackingEvents();
  const [testMachineStatus, messages, interactions, onInteraction, onPlay] = useTesting(status, debug);

  const checkTMStatus = React.useCallback((...args: TMStatus[]) => args.includes(testMachineStatus as TMStatus), [testMachineStatus]);

  if (status === TestStatus.IDLE) {
    return (
      <Container isPublic={isPublic}>
        <Start start={() => (isPublic ? startTesting() : trackEventsWrapper(startTesting, 'trackActiveProjectPrototypeTestStart')())} />
      </Container>
    );
  }

  return (
    <Container isPublic={isPublic}>
      <Dialog
        isLoading={checkTMStatus(TMStatus.FETCHING_CONTEXT, TMStatus.DIALOG_PROCESSING)}
        messages={messages}
        interactions={interactions}
        onInteraction={onInteraction}
        onPlay={onPlay}
        debug={debug}
      />

      {testMachineStatus === TMStatus.ENDED ? (
        <Reset onClick={resetTesting} />
      ) : (
        <Input
          locale={locale}
          isPublic={isPublic}
          disabled={checkTMStatus(TMStatus.FETCHING_CONTEXT, TMStatus.IDLE, TMStatus.DIALOG_PROCESSING)}
          forceFocus={checkTMStatus(TMStatus.FETCHING_CONTEXT, TMStatus.WAITING_USER_INTERACTION, TMStatus.DIALOG_WAITING_USER_INTERACTION)}
          onUserInput={onInteraction}
        />
      )}
    </Container>
  );
};

const mapStateToProps = {
  status: testingStatusSelector,
  locales: activeLocalesSelector,
  settings: recentTestingSelector,
};

const mapDispatchProps = {
  startTesting,
  resetTesting,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedTestingProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Testing);
