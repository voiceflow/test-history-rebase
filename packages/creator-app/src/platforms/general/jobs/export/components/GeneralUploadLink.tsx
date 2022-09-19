import { Box, Link } from '@voiceflow/ui';
import React from 'react';

const GeneralUploadLink: React.FC = () => {
  return (
    <>
      Generate an executable project version to run on your own infrastructure.
      <Box mt={10}>
        <Link href="https://github.com/voiceflow/general-runtime#configurations">Learn More</Link>
      </Box>
    </>
  );
};

export default GeneralUploadLink;
