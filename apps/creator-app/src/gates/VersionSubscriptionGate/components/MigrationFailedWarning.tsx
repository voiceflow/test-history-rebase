import { Box, Button, FlexCenter, PageError, Spinner } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

const MIGRATION_REATTEMPT_TIMEOUT = 5000;

export interface MigrationFailedWarningProps {
  onReset: VoidFunction;
}

const MigrationFailedWarning: React.FC<MigrationFailedWarningProps> = ({ onReset }) => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  React.useEffect(() => {
    const timer = setTimeout(onReset, MIGRATION_REATTEMPT_TIMEOUT);

    return () => clearTimeout(timer);
  }, []);

  return (
    <FlexCenter style={{ height: '100%' }} fullWidth>
      <PageError icon={<Spinner />} title="Assistant Migration Failed" message="The assistant will load automatically when the migration is complete">
        <Box mt={16}>
          <Button onClick={goToDashboard}>Go to Dashboard</Button>
        </Box>
      </PageError>
    </FlexCenter>
  );
};

export default MigrationFailedWarning;
