import * as Realtime from '@voiceflow/realtime-sdk';

import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useHotKeys, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

interface HotkeysOptions {
  isOpen?: boolean;
  openMenu: VoidFunction;
  closeMenu: VoidFunction;
}

export const useMenuHotKeys = ({ openMenu, isOpen, closeMenu }: HotkeysOptions): void => {
  const topicsAndComponents = useFeature(Realtime.FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  useHotKeys(Hotkey.OPEN_DESIGN_MENU_LAYERS_TAB, openMenu, {
    preventDefault: true,
    disable: !(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion),
  });

  useHotKeys(
    Hotkey.CLOSE_DESIGN_MENU,
    () => {
      if (isOpen) closeMenu();
    },
    { preventDefault: true },
    [isOpen]
  );
};
