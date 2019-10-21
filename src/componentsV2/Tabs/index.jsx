import React from 'react';

import { useKeygen } from '@/components/KeyedComponent';
import Tab from '@/componentsV2/Tab';
import TabSet from '@/componentsV2/TabSet';

function Tabs({ options, selected, onChange }) {
  const genKey = useKeygen();

  return (
    <TabSet>
      {options.map(({ value, label }, index) => (
        <Tab isActive={selected === index} onClick={() => onChange(index)} key={genKey(value)}>
          {label}
        </Tab>
      ))}
    </TabSet>
  );
}

export default Tabs;
