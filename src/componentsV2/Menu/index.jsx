import React from 'react';
import { generateLocalKey } from 'react-smart-key/dist/es2015/generateKey';

import { FlexLabel } from '@/componentsV2/Flex';

import { Container, Item } from './components';

class Menu extends React.PureComponent {
  genKey = this.props.getKey || generateLocalKey();

  render() {
    const { options, onSelect } = this.props;

    return (
      <Container>
        {options.map(({ value, label }) => (
          <Item onClick={() => onSelect(value)} key={this.genKey(value)}>
            <FlexLabel>{label || (typeof value === 'string' ? value : value.toString())}</FlexLabel>
          </Item>
        ))}
      </Container>
    );
  }
}

export default Menu;
