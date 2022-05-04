import React from 'react';
import { useSelector } from 'react-redux';

import * as Creator from '@/ducks/creator';
import { ManagerContext } from '@/pages/Canvas/contexts';

import EditorSidebarV2 from '../EditorSidebarV2';
import Sidebar from './sidebar';

const EditSidebar: React.FC = () => {
  const getManager = React.useContext(ManagerContext)!;

  const node = useSelector(Creator.focusedNodeSelector);

  return !!node && !!getManager(node.type).editorV2 ? <EditorSidebarV2 /> : <Sidebar />;
};

export default EditSidebar;
