import { shallow } from 'enzyme';
import React from 'react';

import CaptionedIconButton from '..';

let component;

describe('Captioned Icon Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<CaptionedIconButton icon="plus">label</CaptionedIconButton>);
  });
});
