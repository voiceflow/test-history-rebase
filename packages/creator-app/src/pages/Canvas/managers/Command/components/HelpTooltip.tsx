import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const HelpTooltip: React.FC<{ isComponent?: boolean }> = ({ isComponent }) => (
  <>
    <Paragraph>
      Commands can be accessed by the user from anywhere in your project. For example, if a user says “Help”, they will activate the help{' '}
      {isComponent ? 'component' : 'flow'}. Since the help intent is housed in a Command, once the user is done the{' '}
      {isComponent ? 'component' : 'flow'} they will return to where they were previously in your project.
    </Paragraph>
    <Paragraph>We can think of Commands as a jump and return function inside our project</Paragraph>
  </>
);

export default HelpTooltip;
