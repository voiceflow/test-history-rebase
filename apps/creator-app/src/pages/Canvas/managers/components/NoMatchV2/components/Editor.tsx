import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import Actions from '../../Actions';
import RootEditor from './RootEditor';

const Route = () => (
  <EditorV2.Route path="" component={RootEditor}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);

export default Route;
