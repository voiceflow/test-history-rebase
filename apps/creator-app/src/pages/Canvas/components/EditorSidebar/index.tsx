import React from 'react';
import { useSelector } from 'react-redux';

import { TransactionProvider } from '@/contexts/TransactionContext';
import * as Creator from '@/ducks/creatorV2';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import { ManagerContext } from '@/pages/Canvas/contexts';

import EditorSidebarV2 from '../EditorSidebarV2';
import Sidebar from './sidebar';

const EditSidebar: React.FC = () => {
  const getManager = React.useContext(ManagerContext)!;

  const node = useSelector(Creator.focusedNodeSelector);
  const transaction = useDispatch(History.transaction);

  return (
    <TransactionProvider value={transaction}>{!!node && !!getManager(node.type).editorV2 ? <EditorSidebarV2 /> : <Sidebar />}</TransactionProvider>
  );
};

export default EditSidebar;
