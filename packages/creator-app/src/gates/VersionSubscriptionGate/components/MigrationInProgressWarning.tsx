import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, FlexCenter, PageError, Spinner } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { useMigrationDoneObserver, useMigrationFailedObserver } from '../hooks';

export interface MigrationInProgressWarningProps {
  versionID: string;
  onComplete: (result: Realtime.version.schema.NegotiateResultPayload) => void;
  onFailed: VoidFunction;
}

const MigrationInProgressWarning: React.FC<MigrationInProgressWarningProps> = ({ versionID, onComplete, onFailed }) => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  useMigrationFailedObserver(versionID, onFailed);
  useMigrationDoneObserver(versionID, onComplete);

  return (
    <FlexCenter style={{ height: '100%' }} fullWidth>
      <PageError icon={<Spinner />} title="Migration in Progress" message="The assistant will load automatically when the migration is complete">
        <Box mt={16}>
          <Button onClick={goToDashboard}>Go to Dashboard</Button>
        </Box>
      </PageError>
    </FlexCenter>
  );
};

export default MigrationInProgressWarning;
