import _noop from 'lodash/noop';
import React from 'react';

import Multimodal from '.';

const DISPLAYS = [
  {
    name: 'VisualTmplateTest',
    id: 'displayMockId',
  },
  {
    name: 'VisualTmplateTest2',
    id: 'displayMockId2',
  },
  {
    name: 'VisualTmplateTest3',
    id: 'displayMockId3',
  },
];

const getProps = () => ({
  deleteDisplay: _noop,
  setConfirm: _noop,
  displays: DISPLAYS,
  history: {},
  skill_id: 'mockId',
});

export default {
  title: 'Visuals/Multimodal',
  component: Multimodal.WrappedComponent,
};

export const loaded = () => <Multimodal.WrappedComponent {...getProps()} />;

export const loading = () => <Multimodal.WrappedComponent loading />;
