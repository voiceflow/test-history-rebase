// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import RadioButtonContainer from './components/RadioButtonContainer';
import Container from './components/RadioGroupContainer';

export const YES_NO_RADIO_BUTTONS = [
  {
    id: true,
    label: 'Yes',
  },
  {
    id: false,
    label: 'No',
  },
];

export default function RadioGroup({ options = YES_NO_RADIO_BUTTONS, name, checked, onChange, ...props }) {
  return (
    <Container>
      {options.map((button, index) => {
        return (
          <RadioButtonContainer key={index}>
            <Checkbox type="radio" {...props} name={name} value={button.id} checked={checked === button.id} onChange={() => onChange(button.id)}>
              <div>{button.label}</div>
            </Checkbox>
          </RadioButtonContainer>
        );
      })}
    </Container>
  );
}

RadioGroup.propTypes = {
  checked: PropTypes.any,
  onChange: PropTypes.func,
};
