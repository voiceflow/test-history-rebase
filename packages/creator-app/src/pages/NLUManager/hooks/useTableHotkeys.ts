import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';

const useTableHotkeys = (items: any[]) => {
  const nluManager = useNLUManager();

  useHotKeys(Hotkey.NLU_TABLE_ESC, () => nluManager.toggleActiveItemID(null), { preventDefault: true });

  useHotKeys(
    Hotkey.NLU_TABLE_TAB,
    () => {
      if (!items) return;
      const currentIndex = items.findIndex((i) => i.id === nluManager.activeItemID);
      const isLastItem = currentIndex === items.length;

      if (isLastItem) return;

      const nextItem = items[currentIndex + 1];

      if (nextItem) {
        nluManager.toggleActiveItemID(nextItem.id);
      }
    },
    { preventDefault: true },
    [nluManager.toggleActiveItemID, items]
  );
};

export default useTableHotkeys;
