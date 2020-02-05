import { configure } from '@storybook/react';

import { configureStorybook } from './utils';

configureStorybook();

configure(require.context('../src', true, /\.story\.mdx$/), module);
