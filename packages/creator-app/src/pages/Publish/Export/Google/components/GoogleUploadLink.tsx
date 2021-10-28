import { Box, Link } from '@voiceflow/ui';
import React from 'react';

const GoogleUploadLink: React.FC = () => {
  return (
    <>
      Upload to Google and generate an executable project version to run on your own infrastructure.
      <Box mt={10}>
        <Link href="https://github.com/voiceflow/google-runtime#configurations">Learn More</Link>
      </Box>
    </>
  );
};

export default GoogleUploadLink;
