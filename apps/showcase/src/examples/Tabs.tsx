import { Tabs } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const renderBaseBlock = (children: JSX.Element) => <div style={{ width: 386 }}>{children}</div>;

const WithState = () => {
  const [value, setValue] = React.useState('Upload');

  return (
    <Tabs value={value} onChange={setValue}>
      <Tabs.Tab value="Upload">Upload</Tabs.Tab>
      <Tabs.Tab value="Link">Link</Tabs.Tab>
      <Tabs.Tab value="Other">Other</Tabs.Tab>
    </Tabs>
  );
};

const tabs = createExample('Tabs', () => renderBaseBlock(<WithState />));

export default createSection('Tabs', 'src/components/Upload/index.ts', [tabs]);
