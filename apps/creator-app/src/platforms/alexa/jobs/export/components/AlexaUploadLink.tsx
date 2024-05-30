import { Link } from '@voiceflow/ui';
import React from 'react';

const AlexaUploadLink: React.FC = () => (
  <>
    Upload to Alexa and generate an executable agent version to run on your own infrastructure.{' '}
    <Link href="https://github.com/voiceflow/alexa-runtime#configurations">Learn More</Link>
  </>
);

export default AlexaUploadLink;
