import { Utils } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { NLURoute } from '@/config/routes';

import useEditorTab from '../hooks/useEditorTab';
import useFilter from '../hooks/useFilter';
import useNavigation from '../hooks/useNavigation';
import useNLUPersistedState from '../hooks/useNLUPersistedState';
import usePage from '../hooks/usePage';
import useNLUEntities, { ENTITIES_INTIAL_STATE } from './entity';
import useNLUIntents, { INTENTS_INTIAL_STATE } from './intent';

export interface NLUManagerContextValue
  extends ReturnType<typeof useEditorTab>,
    ReturnType<typeof useNavigation>,
    ReturnType<typeof useNLUIntents>,
    ReturnType<typeof useNLUEntities>,
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
  hovered: null,
  setHovered: Utils.functional.noop,
  closeEditorTab: Utils.functional.noop,
  openEditorTab: Utils.functional.noop,
  editorTab: null,
  inFullScreenTab: false,
  isEditorTabActive: () => false,
  isScrolling: false,
  handleVirtualScroll: Utils.functional.noop,
  setIsScrolling: Utils.functional.noop,
  resetSelection: Utils.functional.noop,
  handleScroll: Utils.functional.noop,
  scrollToTop: Utils.functional.noop,
  tableRef: React.createRef(),
  virtualScrollRef: React.createRef(),
  ...INTENTS_INTIAL_STATE,
  ...ENTITIES_INTIAL_STATE,
};

const INITIAL_PERSISTED_STATE = { id: INITIAL_STATE.activeItemID, tab: INITIAL_STATE.activeTab };

export const NLUManagerContext = React.createContext<NLUManagerContextValue>(INITIAL_STATE);

export const NLUManagerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { state, updateState } = useNLUPersistedState(INITIAL_PERSISTED_STATE);
  const navigation = useNavigation({ ...state, onTabChange: updateState });
  const filter = useFilter(navigation.activeTab);
  const intents = useNLUIntents({ activeItemID: navigation.activeItemID, goToItem: navigation.goToItem });
  const entities = useNLUEntities({ activeItemID: navigation.activeItemID, goToItem: navigation.goToItem });
  const editor = useEditorTab();
  const page = usePage(navigation.activeItemID);
  const resetSelection = () => {
    navigation.goToItem(null);
    editor.closeEditorTab();
  };

  const api = useContextApi<NLUManagerContextValue>({
    ...filter,
    ...navigation,
    ...intents,
    ...entities,
    ...editor,
    ...page,
    resetSelection,
  });

  return <NLUManagerContext.Provider value={api}>{children}</NLUManagerContext.Provider>;
};

export const useNLUManager = (): NLUManagerContextValue => React.useContext(NLUManagerContext) as NLUManagerContextValue;
