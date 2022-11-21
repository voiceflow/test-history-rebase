import { Link } from '@voiceflow/ui';
import React from 'react';

import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

const ProjectName: React.FC = () => (
  <DescriptorContainer>
    Your project name is the name of the project that you will see on your workspace dashboard. <br />
    This is an internal name an is <b>not</b> your Invocation name.
  </DescriptorContainer>
);

const InvocationName: React.FC = () => (
  <DescriptorContainer>
    The name users will say or type to interact with your Google Action. This does not need to be the same as your project name, but must comply with
    these <Link href="https://developers.google.com/assistant/conversational/df-asdk/discovery">guidelines.</Link>
  </DescriptorContainer>
);

const Locales: React.FC = () => <DescriptorContainer>Choose the language you would like your Google Action to support.</DescriptorContainer>;

export default { ProjectName, InvocationName, Locales };
