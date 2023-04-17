import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { NLURoute, Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';

interface MatchPathParams {
  tab: NLURoute;
  itemID?: string;
}

interface UseNavigationProps {
  tab: NLURoute;
  itemID?: string | null;
  onTabChange?: (newState: { tab: NLURoute; itemID?: string | null }) => void;
}

const useNavigation = ({ tab, itemID, onTabChange }: UseNavigationProps) => {
  const location = useLocation();

  const modelMatch = React.useMemo(() => matchPath<MatchPathParams>(location.pathname, { path: [Path.NLU_MANAGER_TAB] }), [location.pathname]);
  const goToCurrentNLUManagerTab = useDispatch(Router.goToCurrentNLUManagerTab);

  const activeTab = modelMatch?.params.tab ?? tab ?? NLURoute.INTENTS;
  const activeItemID = modelMatch?.params.itemID ? decodeURIComponent(modelMatch.params.itemID) : itemID ?? '';

  const [trackingEvents] = useTrackingEvents();

  const goToTab = (tab: NLURoute, itemID?: string | null) => {
    trackingEvents.trackNLUManagerNavigation({ tab });

    goToCurrentNLUManagerTab(tab, itemID);

    if (onTabChange) {
      onTabChange({ tab, itemID });
    }
  };

  const goToItem = (itemID: string | null) => {
    if (activeItemID === itemID) return;
    goToTab(activeTab, itemID);
  };

  const toggleActiveItemID = (id: string | null) => goToItem(activeItemID === id ? null : id);
  const [hovered, setHovered] = React.useState<string | null>(null);

  return {
    activeTab,
    activeItemID,
    goToItem,
    goToTab,
    toggleActiveItemID,
    hovered,
    setHovered,
  };
};

export default useNavigation;
