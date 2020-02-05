import React from 'react';

import { UploadingSpinner } from '..';

function Loading() {
  return (
    <>
      <UploadingSpinner color="transparent" isMd isEmpty />
      <span>Uploading</span>
    </>
  );
}

export default Loading;
