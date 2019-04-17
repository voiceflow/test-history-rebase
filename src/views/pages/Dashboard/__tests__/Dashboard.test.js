import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { DashBoard } from '../index.jsx';
import toJson from 'enzyme-to-json';
import _ from 'lodash'

const clickFn = jest.fn()

const props = {
  team: {
    team_id: 1,
    state: null
  },
  teams: {
    byId: {},
    allIds: []
  },
  projects_array: [],
  getMembers: () => new Promise(resolve => resolve()),
  fetchProjects: () => new Promise(resolve => resolve()),
  user: {
    id: 1
  }
}

describe('Dashboard', () => {
    it('render dashboard', () => {
        const component = shallow( <DashBoard {...props}/> );
        expect(toJson(component)).toMatchSnapshot()
    });
})

describe('dashboard create skill', () => {
    it ('create new skill', () => {
        global.user_detail = {
            admin: 100,
            email: "jason@getvoiceflow.com",
            first_login: false,
            iat: 1550192538,
            id: 18,
            name: "Jason Zhao",
            verified: null,
        }
        const component = shallow(<DashBoard onClick={clickFn} {...props}/>)
        component.unmount()
    })
})
