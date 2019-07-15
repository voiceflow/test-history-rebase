/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

process.env.LOGROCKET_PROJECT = '<LOGROCKET_PROJECT>';
process.env.GOOGLE_OAUTH_ID = '<GOOGLE OAUTH ID>';

configure({ adapter: new Adapter() });
