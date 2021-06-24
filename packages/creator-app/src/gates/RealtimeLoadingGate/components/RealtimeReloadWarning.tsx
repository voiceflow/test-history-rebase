import { FlexCenter, PageError } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

const RealtimeReloadWarning: React.FC = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <PageError title="" message="Something went wrong. Try reloading the page.">
      <Link to="" onClick={() => window.location.reload()} className="btn btn-primary mt-3">
        Reload Page
      </Link>
    </PageError>
  </FlexCenter>
);

export default RealtimeReloadWarning;
