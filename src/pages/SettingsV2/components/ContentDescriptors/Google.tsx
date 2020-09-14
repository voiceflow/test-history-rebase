import React from 'react';

import { DescriptorContainer } from '@/pages/SettingsV2/components/ContentDescriptors/components';

const ProjectName: React.FC = () => {
  return (
    <DescriptorContainer>
      Your project name is the name of the project that you will see on your workspace dashboard. <br />
      This is an internal name an is <b>not</b> your Invocation name.
    </DescriptorContainer>
  );
};

const InvocationName: React.FC = () => {
  return (
    <DescriptorContainer>
      The name users will say or type to interact with your Google Action. This does not need to be the same as your project name, but must comply
      with these
      <a target="_blank" rel="noreferrer" href="https://developers.google.com/assistant/conversational/df-asdk/discovery">
        {' '}
        guidelines.
      </a>
    </DescriptorContainer>
  );
};

const Locales: React.FC = () => {
  return <DescriptorContainer>Choose the language you would like your Google Action to support.</DescriptorContainer>;
};

export default { ProjectName, InvocationName, Locales };
