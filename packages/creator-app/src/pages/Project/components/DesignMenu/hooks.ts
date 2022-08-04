import React from 'react';

import { Permission } from '@/config/permissions';
import * as UI from '@/ducks/ui';
import { useHasPermissions, useHotKeys, usePermission, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Tab, TabItem, TOPICS_TABS } from './constants';

export const useTabs = (): { tabs: TabItem[]; selectedTab: Tab } => {
  const activeTab = useSelector(UI.activeCreatorMenuSelector);
  const hasPermissions = useHasPermissions();

  const tabs = React.useMemo(() => TOPICS_TABS.filter(({ permissions }) => hasPermissions(permissions)), [hasPermissions]);

  const selectedTab = React.useMemo(() => {
    if (tabs.find(({ value }) => value === activeTab)) {
      return activeTab as Tab;
    }

    if (tabs.find(({ value }) => value === Tab.STEPS)) {
      return Tab.STEPS;
    }

    return Tab.LAYERS;
  }, [activeTab, tabs]);

  return { tabs, selectedTab };
};

interface HotkeysOptions {
  openByHover: VoidFunction;
  setActiveTab: (tab: Tab) => void;
  isOpenByHover?: boolean;
  toggleIsHidden: VoidFunction;
  closeByLoseHover: VoidFunction;
}

export const useMenuHotKeys = ({ openByHover, setActiveTab, isOpenByHover, toggleIsHidden, closeByLoseHover }: HotkeysOptions): void => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  useHotKeys(
    Hotkey.OPEN_DESIGN_MENU_LAYERS_TAB,
    () => {
      setActiveTab(Tab.LAYERS);
      openByHover();
    },
    { preventDefault: true }
  );

  useHotKeys(
    Hotkey.OPEN_DESIGN_MENU_STEPS_TAB,
    () => {
      setActiveTab(Tab.STEPS);
      openByHover();
    },
    { preventDefault: true, disable: !canEditCanvas }
  );

  useHotKeys(
    Hotkey.TOGGLE_DESIGN_MENU_LOCK,
    () => {
      toggleIsHidden();

      if (isOpenByHover) {
        closeByLoseHover();
      }
    },
    { preventDefault: true },
    [isOpenByHover]
  );

  useHotKeys(
    Hotkey.CLOSE_DESIGN_MENU,
    () => {
      if (!isOpenByHover) return;

      closeByLoseHover();
    },
    { preventDefault: true },
    [isOpenByHover]
  );
};
