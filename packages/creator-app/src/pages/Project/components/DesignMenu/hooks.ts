import React from 'react';
import { ConnectDropTarget, useDrop } from 'react-dnd';

import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { DragItem, ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as UI from '@/ducks/ui';
import { useFeature, useHasPermissions, useHotKeys, useModals, usePermission, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Tab, TabItem, TABS, TOPICS_TABS } from './constants';

export const useTabs = (): { tabs: TabItem[]; selectedTab: Tab } => {
  const activeTab = useSelector(UI.activeCreatorMenuSelector);
  const hasPermissions = useHasPermissions();
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const tabs = React.useMemo(() => {
    const featureTabs = topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? TOPICS_TABS : TABS;

    return featureTabs.filter(({ permissions }) => hasPermissions(permissions));
  }, [hasPermissions, topicsAndComponents.isEnabled, isTopicsAndComponentsVersion]);

  const selectedTab = React.useMemo(() => {
    if (tabs.find(({ value }) => value === activeTab)) {
      return activeTab as Tab;
    }

    if (tabs.find(({ value }) => value === Tab.STEPS)) {
      return Tab.STEPS;
    }

    return isTopicsAndComponentsVersion ? Tab.LAYERS : Tab.FLOWS;
  }, [activeTab, tabs, isTopicsAndComponentsVersion]);

  return { tabs, selectedTab };
};

/* This hook doesn't do anything functional,
 * but it prevents the awful lag when dropping steps back onto the step menu
 */
export const useDropLagFix = (): ConnectDropTarget => {
  const [, dropRef] = useDrop({ accept: [DragItem.BLOCK_MENU, DragItem.TOPICS, DragItem.COMPONENTS] });

  React.useEffect(
    () => () => {
      dropRef(null);
    },
    [dropRef]
  );

  return dropRef;
};

interface HotkeysOptions {
  openByHover: VoidFunction;
  setActiveTab: (tab: Tab) => void;
  isOpenByHover?: boolean;
  toggleIsHidden: VoidFunction;
  closeByLoseHover: VoidFunction;
}

export const useMenuHotKeys = ({ openByHover, setActiveTab, isOpenByHover, toggleIsHidden, closeByLoseHover }: HotkeysOptions): void => {
  const imModal = useModals(ModalType.INTERACTION_MODEL);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  // TODO: remove this after topics and components are fully implemented
  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB,
    () => {
      setActiveTab(Tab.FLOWS);
      openByHover();
    },
    { preventDefault: true, disable: !!topicsAndComponents.isEnabled && isTopicsAndComponentsVersion }
  );

  // TODO: remove this after topics and components are fully implemented
  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB,
    () => {
      setActiveTab(Tab.STEPS);
      openByHover();
    },
    { preventDefault: true, disable: (!!topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) || !canEditCanvas }
  );

  useHotKeys(
    Hotkey.OPEN_DESIGN_MENU_LAYERS_TAB,
    () => {
      setActiveTab(Tab.LAYERS);
      openByHover();
    },
    { preventDefault: true, disable: !(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) }
  );

  useHotKeys(
    Hotkey.OPEN_DESIGN_MENU_STEPS_TAB,
    () => {
      setActiveTab(Tab.STEPS);
      openByHover();
    },
    { preventDefault: true, disable: !(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) || !canEditCanvas }
  );

  useHotKeys(
    Hotkey.TOGGLE_DESIGN_MENU_LOCK,
    () => {
      toggleIsHidden();

      if (isOpenByHover) {
        closeByLoseHover();
      }
    },
    { preventDefault: true, disable: imModal.isOpened },
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
