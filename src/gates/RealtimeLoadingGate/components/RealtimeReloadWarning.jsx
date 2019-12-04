import React from 'react';
import { Link } from 'react-router-dom';

import Error from '@/components/ErrorPages/Error';
import { FlexCenter } from '@/componentsV2/Flex';

const RealtimeReloadWarning = () => (
  <FlexCenter style={{ height: '100%' }} fullWidth>
    <Error message="Something went wrong. Try reloading the page.">
      <Link to="" onClick={() => window.location.reload()} className="btn btn-primary mt-3">
        Reload Page
      </Link>
    </Error>
  </FlexCenter>
);

export default RealtimeReloadWarning;
