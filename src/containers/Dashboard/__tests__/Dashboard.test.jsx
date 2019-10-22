import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import React from 'react';

import { DashBoard } from '..';

const clickFn = jest.fn();

const props = {
  team: {
    team_id: 1,
    state: null,
  },
  teams: {
    byId: {},
    allIds: [],
  },
  projects: {
    byId: {},
    allIds: [],
  },
  fetchProjects: () => new Promise((resolve) => resolve()),
  user: {
    id: 1,
  },
};

describe('Dashboard', () => {
  it('render dashboard', () => {
    // TODO: broken test
    const component = shallow(<DashBoard {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});

describe('dashboard create skill', () => {
  it('create new skill', () => {
    global.user_detail = {
      admin: 100,
      email: 'jason@getvoiceflow.com',
      first_login: false,
      iat: 1550192538,
      id: 18,
      name: 'Jason Zhao',
      verified: null,
    };
    const component = shallow(<DashBoard onClick={clickFn} {...props} />);
    component.unmount();
  });
});
