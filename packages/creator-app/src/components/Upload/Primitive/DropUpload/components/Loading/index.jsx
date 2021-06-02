import React from 'react';

import { UploadingSpinner } from '..';

const Loading = () => (
  <>
    <UploadingSpinner color="transparent" isMd isEmpty />
    <span>Uploading</span>
  </>
);

export default Loading;
