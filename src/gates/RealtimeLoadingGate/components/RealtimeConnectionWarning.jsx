import React from 'react';
import { Link } from 'react-router-dom';

import Error from '@/components/ErrorPages/Error';
import { FlexCenter } from '@/components/Flex';
import { Spinner } from '@/components/Spinner';

const RealtimeConnectionWarning = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <Error icon={<Spinner message="Reconnecting..." />} message="Something went wrong. Try reloading the page.">
      <Link to="" onClick={() => window.location.reload()} className="btn btn-primary mt-3">
        Reload Page
      </Link>
    </Error>
  </FlexCenter>
);

export default RealtimeConnectionWarning;
