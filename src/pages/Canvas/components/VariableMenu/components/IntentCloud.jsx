/* eslint-disable no-shadow */
import React from 'react';
import { Label } from 'reactstrap';

import { FlexApart } from '@/components/Flex';
import * as Panel from '@/components/Panel';
import ClickableText from '@/components/Text/ClickableText';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

const IntentCloud = () => {
  const { toggle } = useModals(ModalType.INTENTS);

  return (
    <Panel.Section>
      <FlexApart>
        <Label style={{ marginBottom: 0 }}>Intents</Label>
        <ClickableText onClick={() => toggle()}>edit</ClickableText>
      </FlexApart>
    </Panel.Section>
  );
};

export default IntentCloud;
