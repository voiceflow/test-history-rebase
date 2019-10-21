import React from 'react';

import PhonePreview from '@/components/PhonePreview';
import Button from '@/componentsV2/Button';
import { FlexCenter } from '@/componentsV2/Flex';

import Container from './Container';

function PermissionPreview({ toggleSettings }) {
  return (
    <Container center>
      <div className="px-4">
        <label>Send a Permission Request Card to the user's phone/device</label>
      </div>
      <div className="px-5">
        <PhonePreview image="/images/permissions.png" />
      </div>
      <FlexCenter>
        <Button variant="secondary" onClick={toggleSettings}>
          Settings
        </Button>
      </FlexCenter>
    </Container>
  );
}

export default PermissionPreview;
