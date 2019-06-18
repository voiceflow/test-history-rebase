/* eslint-disable import/no-extraneous-dependencies */
import { mount, shallow } from 'enzyme/build';
import { shape } from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

// Instantiate router context
const router = {
  history: new BrowserRouter().history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: shape({}) },
});

export function mountWrap(node) {
  return mount(node, createContext());
}

export function shallowWrap(node) {
  return shallow(node, createContext());
}
