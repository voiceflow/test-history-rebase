import { BaseNode } from '@voiceflow/base-types';

export const BODY_OPTIONS = [
  {
    id: BaseNode.Api.APIBodyType.FORM_DATA,
    label: 'Form Data',
  },
  {
    id: BaseNode.Api.APIBodyType.URL_ENCODED,
    label: 'URL Encoded',
  },
  {
    id: BaseNode.Api.APIBodyType.RAW_INPUT,
    label: 'Raw',
  },
];

export const mappingFactory = () => ({ path: '', var: null });

export const expressionFactory = () => ({ key: '', val: '' });
