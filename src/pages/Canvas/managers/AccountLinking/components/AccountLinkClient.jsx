import React from 'react';

import Input from '@/components/Input';
import { FormControl, Section } from '@/pages/Canvas/components/Editor';

const AccountLinkClient = ({ data, onUpate }) => (
  <Section>
    <FormControl label="Client ID">
      <Input
        className="form-control-border form-control"
        value={data.clientId}
        placeholder="Client ID"
        onChange={(e) => onUpate('clientId', e.target.value)}
      />
    </FormControl>
    <FormControl label="Client Secret" contentBottomUnits={0}>
      <Input
        type="password"
        value={data.clientSecret}
        placeholder="Client Secret"
        onChange={(e) => onUpate('clientSecret', e.target.value)}
        autoComplete="new-password"
      />
    </FormControl>
  </Section>
);

export default AccountLinkClient;
