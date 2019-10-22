import { mount } from 'enzyme';
import React from 'react';

import { compose } from '@/utils/functional';
import { withRedux, withTheme } from '@/utils/testing';

import AmazonLogin from '../AmazonLogin';

describe('Amazon Login Test', () => {
  const Component = compose(
    withRedux(),
    withTheme()
  )(AmazonLogin);

  it('render empty card', () => {
    const component = mount(<Component />);

    expect(component.find(AmazonLogin)).toMatchSnapshot();
  });
});
