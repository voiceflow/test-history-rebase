import React from 'react';

import { UploadingSpinner } from '../styles';

const Loading = () => (
  <>
    <UploadingSpinner color="transparent" isMd />
    <span>Uploading</span>
  </>
);

export default Loading;
