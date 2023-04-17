import { useHotkeyList } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { useNLUManager } from '../context';

const useTableHotkeys = (items: any[]) => {
  const nluManager = useNLUManager();

  const onTableTab = () => {
    if (!items) return;
    const currentIndex = items.findIndex((i) => i.id === nluManager.activeItemID);
    const isLastItem = currentIndex === items.length;

    if (isLastItem) return;

    const nextItem = items[currentIndex + 1];

    if (nextItem) {
      nluManager.toggleActiveItemID(nextItem.id);
    }
  };

  useHotkeyList([
    { hotkey: Hotkey.NLU_TABLE_ESC, callback: nluManager.resetSelection, preventDefault: true },
    { hotkey: Hotkey.NLU_TABLE_TAB, callback: onTableTab, preventDefault: true },
  ]);
};

export default useTableHotkeys;
