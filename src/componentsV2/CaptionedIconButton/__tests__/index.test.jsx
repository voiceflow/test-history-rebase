import { shallow } from 'enzyme';
import React from 'react';

import PlusIcon from '@/svgs/plus.svg';

import CaptionedIconButton from '..';

let component;

describe('Captioned Icon Button', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders', () => {
    component = shallow(<CaptionedIconButton icon={PlusIcon}>label</CaptionedIconButton>);
  });
});
