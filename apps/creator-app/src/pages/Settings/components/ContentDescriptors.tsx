import React from 'react';

import * as Settings from '@/components/Settings';

export const ContinuePrevious: React.FC = () => (
  <Settings.SubSection.Description>
    When toggled on, your project will remember where a user left off at in their previous session. You’ll then be able to ask them if they wish to
    continue from that point.
  </Settings.SubSection.Description>
);

export const AllowRepeat: React.FC = () => (
  <Settings.SubSection.Description>
    When toggled on, users will be able to say ‘repeat’ at any point in the conversation to replay the previous speak step, or all the content from
    the last interaction.
  </Settings.SubSection.Description>
);

export const DefaultVoice: React.FC = () => (
  <Settings.SubSection.Description>The default text-to-speech voice used across your assistant.</Settings.SubSection.Description>
);

export const RepeatDialog: React.FC = () => (
  <Settings.SubSection.Description>This option will repeat the last speak step before the user said “repeat”.</Settings.SubSection.Description>
);

export const RepeatEverything: React.FC = () => (
  <Settings.SubSection.Description>
    This option will repeat all steps after the users previous interacted with your project.
  </Settings.SubSection.Description>
);
