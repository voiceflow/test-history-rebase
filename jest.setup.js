import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

registerRequireContextHook();

process.env.LOGROCKET_PROJECT = '<LOGROCKET_PROJECT>';
process.env.GOOGLE_OAUTH_ID = '<GOOGLE OAUTH ID>';

configure({ adapter: new Adapter() });
