import { Box, Link } from '@voiceflow/ui';
import React from 'react';

const AlexaUploadLink: React.OldFC = () => {
  return (
    <>
      Upload to Alexa and generate an executable project version to run on your own infrastructure.
      <Box mt={10}>
        <Link href="https://github.com/voiceflow/alexa-runtime#configurations">Learn More</Link>
      </Box>
    </>
  );
};

export default AlexaUploadLink;
