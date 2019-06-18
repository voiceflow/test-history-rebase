import Home from 'containers/Admin/Home';
import { shallow } from 'enzyme';
import React from 'react';

import InternalLookup from '../components/InternalLookup/InternalLookup';

let wrapped;

beforeEach(() => {
  wrapped = shallow(<Home />);
});

describe('Admin - Home', () => {
  it('Shows a h3 header', () => {
    expect(wrapped.find('h3').length).toEqual(1);
  });

  it('Shows the internal lookup tool', () => {
    expect(wrapped.find(InternalLookup).length).toEqual(1);
  });
});
