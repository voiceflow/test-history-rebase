import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { generateLocalKey } from 'react-smart-key/dist/es5/generateKey';

import { FlexLabel } from '@/componentsV2/Flex';

import { Container, Item } from './components';

class Menu extends React.PureComponent {
  genKey = this.props.getKey || generateLocalKey();

  render() {
    const { options, onSelect } = this.props;

    return (
      <Container>
        <Scrollbars autoHeight autoHide hideTracksWhenNotNeeded>
          {options.map((option) => {
            const { value, label } = option;
            return (
              <Item onClick={() => onSelect(option)} key={this.genKey(value)}>
                <FlexLabel>{label || (typeof value === 'string' ? value : value.toString())}</FlexLabel>
              </Item>
            );
          })}
        </Scrollbars>
      </Container>
    );
  }
}

export default Menu;
