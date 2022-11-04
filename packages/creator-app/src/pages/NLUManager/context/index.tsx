import { Utils } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { NLURoute } from '@/config/routes';

import { useEditorTab, useFilter, useNavigation, useNLUPersistedState, usePage } from '../hooks';
import useNLUEntities, { ENTITIES_INTIAL_STATE } from './entity';
import useNLUIntents, { INTENTS_INTIAL_STATE } from './intent';
import useNLUUnclassifiedData, { UNCLASSIFIED_DATA_INTIAL_STATE } from './unclassified';

export interface NLUManagerContextValue
  extends ReturnType<typeof useEditorTab>,
    ReturnType<typeof useNavigation>,
    ReturnType<typeof useNLUIntents>,
    ReturnType<typeof useNLUEntities>,
    ReturnType<typeof useNLUUnclassifiedData>,
    ReturnType<typeof useFilter>,
    ReturnType<typeof usePage> {
  resetSelection: () => void;
}

const INITIAL_STATE: NLUManagerContextValue = {
  search: '',
  setSearch: Utils.functional.noop,
  activeItemID: '',
  activeTab: NLURoute.INTENTS,
  goToItem: Utils.functional.noop,
  goToTab: Utils.functional.noop,
  toggleActiveItemID: Utils.functional.noop,
  closeEditorTab: Utils.functional.noop,
  openEditorTab: Utils.functional.noop,
  editorTab: null,
  inFullScreenTab: false,
  isEditorTabActive: () => false,
  isScrolling: false,
  setIsScrolling: Utils.functional.noop,
  resetSelection: Utils.functional.noop,
  handleScroll: Utils.functional.noop,
  scrollToTop: Utils.functional.noop,
  tableRef: null as any,
  ...INTENTS_INTIAL_STATE,
  ...ENTITIES_INTIAL_STATE,
  ...UNCLASSIFIED_DATA_INTIAL_STATE,
};

const INITIAL_PERSISTED_STATE = { id: INITIAL_STATE.activeItemID, tab: INITIAL_STATE.activeTab };

export const NLUManagerContext = React.createContext<NLUManagerContextValue>(INITIAL_STATE);

export const NLUManagerProvider: React.FC = ({ children }) => {
  const { state, updateState } = useNLUPersistedState(INITIAL_PERSISTED_STATE);
  const filter = useFilter();
  const navigation = useNavigation({ ...state, onTabChange: updateState });
  const intents = useNLUIntents({ activeItemID: navigation.activeItemID, goToItem: navigation.goToItem });
  const entities = useNLUEntities({ activeItemID: navigation.activeItemID, goToItem: navigation.goToItem });
  const editor = useEditorTab();
  const page = usePage(navigation.activeItemID);
  const unclassified = useNLUUnclassifiedData({ activeItemID: navigation.activeItemID, search: filter.search, scrollToTop: page.scrollToTop });

  const resetSelection = () => {
    navigation.goToItem(null);
    editor.closeEditorTab();
  };

  const api = useContextApi<NLUManagerContextValue>({
    ...filter,
    ...navigation,
    ...intents,
    ...entities,
    ...unclassified,
    ...editor,
    ...page,
    resetSelection,
  });

  return <NLUManagerContext.Provider value={api}>{children}</NLUManagerContext.Provider>;
};

export const useNLUManager = (): NLUManagerContextValue => React.useContext(NLUManagerContext) as NLUManagerContextValue;
