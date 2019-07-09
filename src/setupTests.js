/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

process.env.REACT_APP_LOGROCKET_PROJECT = 'eource/voiceflow';
configure({ adapter: new Adapter() });
