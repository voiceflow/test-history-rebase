import React from 'react';
import { useSelector } from 'react-redux';

import { TransactionProvider } from '@/contexts/TransactionContext';
import * as Creator from '@/ducks/creatorV2';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import { ManagerContext } from '@/pages/Canvas/contexts';

import EditorSidebarV2 from '../EditorSidebarV2';
import EditorV3 from '../EditorV3';
import Sidebar from './sidebar';

const EditSidebar: React.FC = () => {
  const getManager = React.useContext(ManagerContext)!;

  const node = useSelector(Creator.focusedNodeSelector);
  const transaction = useDispatch(History.transaction);

  const getSidebar = () => {
    if (!node) return <Sidebar />;

    const { editorV2, editorV3 } = getManager(node.type);

    if (editorV3) return <EditorV3.Sidebar />;
    if (editorV2) return <EditorSidebarV2 />;

    return <Sidebar />;
  };

  return <TransactionProvider value={transaction}>{getSidebar()}</TransactionProvider>;
};

export default EditSidebar;
