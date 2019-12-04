import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import _noop from 'lodash/noop';

registerRequireContextHook();

process.env.LOGROCKET_PROJECT = '<LOGROCKET_PROJECT>';
process.env.GOOGLE_OAUTH_ID = '<GOOGLE OAUTH ID>';

configure({ adapter: new Adapter() });

window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: _noop,
    removeListener: _noop,
  }));

window.MutationObserver =
  window.MutationObserver ||
  class {
    // eslint-disable-next-line class-methods-use-this
    disconnect() {}

    // eslint-disable-next-line class-methods-use-this
    observe() {}
  };
