import React from 'react';

import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

const ProjectName: React.FC = () => (
  <DescriptorContainer>
    Your project name is the name of the project that you will see on your workspace dashboard. <br />
    This is an internal name an is <b>not</b> your Invocation name.
  </DescriptorContainer>
);

const Locales: React.FC = () => <DescriptorContainer>Choose the language you would like your Dialogflow project to support.</DescriptorContainer>;

export default { ProjectName, Locales };
