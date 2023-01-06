import { Link } from '@voiceflow/ui';
import React from 'react';

import { DescriptorContainer, DescriptorVariant } from '@/pages/Settings/components/ContentDescriptors/components';

const Gadgets: React.OldFC = () => (
  <DescriptorContainer variant={DescriptorVariant.PREFIX}>
    Enable communication between your Skill and custom interfaces.{' '}
    <Link href="https://developer.amazon.com/en-US/docs/alexa/alexa-gadgets-toolkit/custom-interface.html">Custom Interfaces</Link> enable a skill to
    trigger gadget behaviors, and act on information it receives from a gadget.
  </DescriptorContainer>
);

const Events: React.OldFC = () => (
  <DescriptorContainer variant={DescriptorVariant.PREFIX} style={{ marginTop: '6px' }}>
    <Link href="https://developer.amazon.com/en-US/docs/alexa/smapi/skill-events-in-alexa-skills.html">Alexa Skill Events</Link> can be used to notify
    you if a certain event occurs, such as a user linking their account. The notification comes in form of a request to your Skill, which you can then
    act on.
  </DescriptorContainer>
);

const ModelSensitivity: React.OldFC = () => (
  <DescriptorContainer>
    As you increase the sensitivity, AMAZON.FallbackIntent captures more user utterances that aren't supported by your custom intents. By default,
    this is set to low.
    <Link href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/standard-built-in-intents.html#adjust-sensitivity">Learn more.</Link>
  </DescriptorContainer>
);

export default { Gadgets, Events, ModelSensitivity };
