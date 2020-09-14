import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/SettingsV2/components/ContentDescriptors/components';

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
      The name users will say to interact with your Alexa Skill. This does not need to be the same as your project name, but must comply with the
      <a
        target="_blank"
        rel="noreferrer"
        href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/choose-the-invocation-name-for-a-custom-skill.html"
      >
        {' '}
        Invocation Name Guidelines.
      </a>
    </DescriptorContainer>
  );
};

const Locales: React.FC = () => {
  return (
    <DescriptorContainer>
      A{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://developer.amazon.com/en-US/docs/alexa/faq/distribute-your-skill-to-additional-locales-of-the-same-language.html"
      >
        locale{' '}
      </a>
      is the combination of a language and a location. Choose one or more locales you want your Skill to support.
    </DescriptorContainer>
  );
};

const Gadgets: React.FC = () => {
  return (
    <DescriptorContainer variant={DescriptorVariant.PREFIX}>
      Enable communication between your Skill and custom interfaces.{' '}
      <a target="_blank" rel="noreferrer" href="https://developer.amazon.com/en-US/docs/alexa/alexa-gadgets-toolkit/custom-interface.html">
        Custom Interfaces
      </a>{' '}
      enable a skill to trigger gadget behaviors, and act on information it receives from a gadget.
    </DescriptorContainer>
  );
};

const Events: React.FC = () => {
  return (
    <DescriptorContainer variant={DescriptorVariant.PREFIX} style={{ marginTop: '6px' }}>
      <a target="_blank" rel="noreferrer" href="https://developer.amazon.com/en-US/docs/alexa/smapi/skill-events-in-alexa-skills.html">
        Alexa Skill Events
      </a>{' '}
      can be used to notify you if a certain event occurs, such as a user linking their account. The notification comes in form of a request to your
      Skill, which you can then act on.
    </DescriptorContainer>
  );
};

export default { ProjectName, InvocationName, Locales, Gadgets, Events };
