import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

function HelpTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        The User Info block is used to fetch data that the user has given your project permission to access. In order to use the User Info block
        effectively, you must first use the Permissions block to request access to the user's info. The Permissions block will send a card to the
        user's mobile phone where they can accept or decline the permissions request.
      </Paragraph>

      <Title>Important considerations</Title>
      <Paragraph marginBottomUnits={3}>
        If the user reaches this block and we have not been granted access to the specific data type they will exit from the ‘fail’ port of the User
        Info block. We need to think about the design of our voice app to accommodate all states (user has given us permission, user has declined
        permissions request, user has not responded to the permissions request).
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
