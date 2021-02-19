import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import '@/App.css';
import 'react-day-picker/lib/style.css';

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

export const parameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*'
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  }
};
