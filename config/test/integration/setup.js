// DANGER ZONE: required to be in this order for storyshots to work
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

import * as Enzyme from 'enzyme';
import React16Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { addSerializer } from 'jest-specific-snapshot';

addSerializer(styleSheetSerializer);

registerRequireContextHook();
// END DANGER ZONE

Enzyme.configure({ adapter: new React16Adapter() });