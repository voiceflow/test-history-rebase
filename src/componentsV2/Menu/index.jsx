import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { generateLocalKey } from 'react-smart-key/dist/es5/generateKey';

import { FlexLabel } from '@/componentsV2/Flex';
import { stopPropagation } from '@/utils/dom';

import { ButtonContainer, Checkbox, Container, Item } from './components';

class Menu extends React.PureComponent {
  genKey = this.props.getKey || generateLocalKey();

  render() {
    const { options = [], onSelect, multiSelect, selectedItems, buttonLabel, buttonClick } = this.props;

    return (
      <Container>
        <Scrollbars autoHeight autoHide hideTracksWhenNotNeeded>
          {options.map(({ value, label, onClick }) => {
            return (
              <Item
                onClick={stopPropagation(() => {
                  onClick && onClick();
                  onSelect && onSelect(value);
                }, true)}
                key={this.genKey(value)}
              >
                {multiSelect && <Checkbox type="checkbox" readOnly checked={selectedItems.includes(value)} />}
                <FlexLabel>{label || value.toString()}</FlexLabel>
              </Item>
            );
          })}
        </Scrollbars>
        {multiSelect && <ButtonContainer onClick={buttonClick}>{buttonLabel}</ButtonContainer>}
      </Container>
    );
  }
}

export default Menu;
