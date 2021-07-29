import { Box, Button, FlexCenter, PageError, Spinner } from '@voiceflow/ui';
import React from 'react';

const RealtimeConnectionWarning: React.FC = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <PageError icon={<Spinner />} title="Lost Connection" message="We’re attempting to restore your connection">
      <Box mt={16}>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </Box>
    </PageError>
  </FlexCenter>
);

export default RealtimeConnectionWarning;
