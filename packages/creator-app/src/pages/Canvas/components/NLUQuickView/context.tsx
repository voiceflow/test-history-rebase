import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType } from '@/constants';

interface NLUQuickViewProps {
  activeTab: InteractionModelTabType;
  setActiveTab: (tab: InteractionModelTabType) => void;
  selectedID: string;
  setSelectedID: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isActiveItemRename: boolean;
  setIsActiveItemRename: (val: boolean) => void;
}

const DefaultState = {
  activeTab: InteractionModelTabType.INTENTS,
  setActiveTab: Utils.functional.noop,
  selectedID: '',
  setSelectedID: Utils.functional.noop,
  title: '',
  setTitle: Utils.functional.noop,
  isActiveItemRename: false,
  setIsActiveItemRename: Utils.functional.noop,
};

export const NLUQuickViewContext = React.createContext<NLUQuickViewProps>(DefaultState);

export const NLUQuickViewProvider: React.FC = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState(InteractionModelTabType.INTENTS);
  const [selectedID, setSelectedID] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);

  const value: NLUQuickViewProps = {
    activeTab,
    setActiveTab,
    selectedID,
    setSelectedID,
    title,
    setTitle,
    isActiveItemRename,
    setIsActiveItemRename,
  };

  return <NLUQuickViewContext.Provider value={value}>{children}</NLUQuickViewContext.Provider>;
};
