import { shallow } from 'enzyme';
import React from 'react';

import Title from '..';

let component;

describe('Title', () => {
  afterEach(() => expect(component).toMatchSnapshot());

  it('renders heading', () => {
    component = shallow(<Title>heading</Title>);
  });

  it('renders subheading', () => {
    component = shallow(<Title variant="subheading">subheading</Title>);
  });

  it('renders subtitle', () => {
    component = shallow(<Title variant="subtitle">subtitle</Title>);
  });

  it('renders label', () => {
    component = shallow(<Title variant="label">label</Title>);
  });
});
