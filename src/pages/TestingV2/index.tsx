import React from 'react';

import { recentTestingSelector } from '@/ducks/recent';
import { activeLocalesSelector } from '@/ducks/skill';
import { TestStatus, resetTesting, startTesting, testingStatusSelector } from '@/ducks/testingV2';
import { connect } from '@/hocs';

import { Container, Dialog, Input, Reset, Start } from './components';
import { useTesting } from './hooks';
import { TMStatus } from './types';

export type TestingProps = {
  status: TestStatus;
  locale: string;
  debug: boolean;
  isPublic?: boolean;
  startTesting: typeof startTesting;
  resetTesting: typeof resetTesting;
};

const Testing: React.FC<TestingProps> = ({ locale, status, isPublic, startTesting, resetTesting, debug }) => {
  const [testMachineStatus, messages, interactions, onInteraction, onPlay] = useTesting(status, debug);

  const checkTMStatus = React.useCallback((...args: TMStatus[]) => args.includes(testMachineStatus as TMStatus), [testMachineStatus]);

  if (status === TestStatus.IDLE) {
    return (
      <Container isPublic={isPublic}>
        <Start start={() => startTesting()} />
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

const mergeProps = ({ locales }: { locales: string[] }) => ({ locale: locales[0] });

export default connect(mapStateToProps, mapDispatchProps, mergeProps)(Testing);
