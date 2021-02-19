import React from 'react';

export const GoogleInvocationName: React.FC = () => (
  <span>
    The name users will say or type to interact with your Google Action. This must comply with the{' '}
    <a rel="noreferrer" target="_blank" href="https://developers.google.com/assistant/conversational/df-asdk/discovery">
      guidelines
    </a>
    . This can be changed later.
  </span>
);

export const AmazonInvocationName: React.FC = () => (
  <span>
    The name users will say to interact with your Alexa Skill. This must comply with the{' '}
    <a
      rel="noreferrer"
      target="_blank"
      href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/choose-the-invocation-name-for-a-custom-skill.html"
    >
      guidelines
    </a>
    . This can be changed later.
  </span>
);
