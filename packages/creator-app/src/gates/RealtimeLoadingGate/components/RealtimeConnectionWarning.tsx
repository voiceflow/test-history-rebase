import { FlexCenter, PageError, Spinner } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

const RealtimeConnectionWarning: React.FC = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <PageError icon={<Spinner />} title="Lost Connection" message="We’re attempting to restore your connection">
      <Link to="" onClick={() => window.location.reload()} className="btn btn-primary mt-3">
        Reload Page
      </Link>
    </PageError>
  </FlexCenter>
);

export default RealtimeConnectionWarning;
