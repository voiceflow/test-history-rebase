import React from 'react';
import { useSelector } from 'react-redux';

import { TransactionProvider } from '@/contexts/TransactionContext';
import * as Creator from '@/ducks/creatorV2';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';

import EditorSidebarV2 from '../EditorSidebarV2';
import { useGetEditorWithCorrectVersion } from '../EditorSidebarV2/hooks';
import { EditorV3Sidebar } from '../EditorV3/EditorV3Sidebar/EditorV3Sidebar.component';
import Sidebar from './sidebar';

const EditSidebar: React.FC = () => {
  const getEditorWithCorrectVersion = useGetEditorWithCorrectVersion();
  const node = useSelector(Creator.focusedNodeSelector);
  const transaction = useDispatch(History.transaction);

  const getSidebar = () => {
    if (!node) return <Sidebar />;

    const { isV3, Editor } = getEditorWithCorrectVersion(node.type);
    if (Editor) return isV3 ? <EditorV3Sidebar /> : <EditorSidebarV2 />;

    return <Sidebar />;
  };

  return <TransactionProvider value={transaction}>{getSidebar()}</TransactionProvider>;
};

export default EditSidebar;
