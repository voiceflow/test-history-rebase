import React from 'react';

import { Paragraph } from '@/componentsV2/Tooltip';

export default function HelpTooltip() {
  return (
    <>
      <Paragraph>
        Commands can be accessed by the user from anywhere in your project. For example, if a user says “Help”, they will activate the help flow.
        Since the help intent is housed in a Command, once the user is done the flow they will retiurn to where they were previously in your project.
      </Paragraph>
      <Paragraph>We can think of Commands as a jump and return function inside our project</Paragraph>
    </>
  );
}
