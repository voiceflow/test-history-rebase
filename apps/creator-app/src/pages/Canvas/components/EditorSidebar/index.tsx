import React from 'react';
import { useSelector } from 'react-redux';

import { TransactionProvider } from '@/contexts/TransactionContext';
import * as Creator from '@/ducks/creatorV2';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';

import EditorSidebarV2 from '../EditorSidebarV2';
import { useGetEditorWithCorrectVersion } from '../EditorSidebarV2/hooks';
import EditorV3 from '../EditorV3';
import Sidebar from './sidebar';

const EditSidebar: React.FC = () => {
  const getEditorWithCorrectVersion = useGetEditorWithCorrectVersion();
  const node = useSelector(Creator.focusedNodeSelector);
  const transaction = useDispatch(History.transaction);

  const getSidebar = () => {
    if (!node) return <Sidebar />;

    const { isV3 } = getEditorWithCorrectVersion(node.type);

    if (isV3) return <EditorV3.Sidebar />;
    if (!isV3) return <EditorSidebarV2 />;

    return <Sidebar />;
  };

  return <TransactionProvider value={transaction}>{getSidebar()}</TransactionProvider>;
};

export default EditSidebar;
