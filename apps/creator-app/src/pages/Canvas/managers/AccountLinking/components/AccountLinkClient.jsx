import { Input } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';

const AccountLinkClient = ({ data, onUpdate }) => (
  <Section>
    <FormControl label="Client ID">
      <Input value={data.clientId} placeholder="Client ID" onChangeText={(value) => onUpdate('clientId', value)} />
    </FormControl>
    <FormControl label="Client Secret" contentBottomUnits={0}>
      <Input
        type="password"
        value={data.clientSecret}
        placeholder="Client Secret"
        onChangeText={(value) => onUpdate('clientSecret', value)}
        autoComplete="new-password"
      />
    </FormControl>
  </Section>
);

export default AccountLinkClient;
