import { CMSRoute } from '@/config/routes';
import { Router } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useDispatch } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';

export const useProjectHotkeys = () => {
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  useHotkey(Hotkey.BACK_TO_KNOWLEDGE_BASE, () => goToCMSResource(CMSRoute.KNOWLEDGE_BASE), { preventDefault: true });
};
