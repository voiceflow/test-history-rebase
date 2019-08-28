import React from 'react';
import { generateLocalKey } from 'react-smart-key/dist/es5/generateKey';

import TabSet from '@/componentsV2/TabSet';
import Tab from '@/componentsV2/TabSet/components/Tab';

class Tabs extends React.PureComponent {
  genKey = this.props.getKey || generateLocalKey();

  render() {
    const { options, selected, onChange } = this.props;

    return (
      <TabSet>
        {options.map(({ value, label }, index) => (
          <Tab isActive={selected === index} onClick={() => onChange(index)} key={this.genKey(value)}>
            {label}
          </Tab>
        ))}
      </TabSet>
    );
  }
}

export default Tabs;
