import { Link } from '@voiceflow/ui';
import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/Settings/components/ContentDescriptors/components';

const ProjectName: React.FC = () => (
  <DescriptorContainer>
    Your project name is the name of the project that you will see on your workspace dashboard. <br />
    This is an internal name an is <b>not</b> your Invocation name.
  </DescriptorContainer>
);

const InvocationName: React.FC = () => (
  <DescriptorContainer>
    The name users will say to interact with your Alexa Skill. This does not need to be the same as your project name, but must comply with the{' '}
    <Link href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/choose-the-invocation-name-for-a-custom-skill.html">
      Invocation Name Guidelines.
    </Link>
  </DescriptorContainer>
);

const Locales: React.FC = () => (
  <DescriptorContainer>
    A{' '}
    <Link href="https://developer.amazon.com/en-US/docs/alexa/faq/distribute-your-skill-to-additional-locales-of-the-same-language.html">locale</Link>{' '}
    is the combination of a language and a location. Choose one or more locales you want your Skill to support.
  </DescriptorContainer>
);

const Gadgets: React.FC = () => (
  <DescriptorContainer variant={DescriptorVariant.PREFIX}>
    Enable communication between your Skill and custom interfaces.{' '}
    <Link href="https://developer.amazon.com/en-US/docs/alexa/alexa-gadgets-toolkit/custom-interface.html">Custom Interfaces</Link> enable a skill to
    trigger gadget behaviors, and act on information it receives from a gadget.
  </DescriptorContainer>
);

const Events: React.FC = () => (
  <DescriptorContainer variant={DescriptorVariant.PREFIX} style={{ marginTop: '6px' }}>
    <Link href="https://developer.amazon.com/en-US/docs/alexa/smapi/skill-events-in-alexa-skills.html">Alexa Skill Events</Link> can be used to notify
    you if a certain event occurs, such as a user linking their account. The notification comes in form of a request to your Skill, which you can then
    act on.
  </DescriptorContainer>
);

const ModelSensitivity: React.FC = () => (
  <DescriptorContainer>
    As you increase the sensitivity, AMAZON.FallbackIntent captures more user utterances that aren't supported by your custom intents. By default,
    this is set to low.
    <Link href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/standard-built-in-intents.html#adjust-sensitivity">Learn more.</Link>
  </DescriptorContainer>
);

export default { ProjectName, InvocationName, Locales, Gadgets, Events, ModelSensitivity };
