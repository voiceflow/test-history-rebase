import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Session from '@/ducks/session';
import { useRAF, useSelector } from '@/hooks';
import { useLocalStorageState } from '@/hooks/storage.hook';

export interface OpenedIDsToggleApi {
  openedIDs: Record<string, boolean>;
  onDragEnd: VoidFunction;
  onDragStart: VoidFunction;
  onNestedDragEnd: VoidFunction;
  onToggleOpenedID: (id: string, value?: boolean) => void;
  onNestedDragStart: (idsToClose: string[]) => void;
}

export const useOpenedIDsToggle = (name: string): OpenedIDsToggleApi => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [openedIDs, setOpenedIDs] = useLocalStorageState<Record<string, boolean>>(`dm-opened-${name}.${activeProjectID}`, {});

  const [scheduler, schedulerApi] = useRAF();
  const openedIDsCache = React.useRef(openedIDs);

  const onDragEnd = usePersistFunction(() => {
    schedulerApi.current.cancel();

    setOpenedIDs({ ...openedIDsCache.current });
  });

  const onDragStart = usePersistFunction(() => {
    openedIDsCache.current = { ...openedIDs };

    scheduler(() => setOpenedIDs({}));
  });

  const onNestedDragStart = usePersistFunction((idsToClose: string[]) => {
    openedIDsCache.current = { ...openedIDs };

    scheduler(() => setOpenedIDs((prevState) => ({ ...prevState, ...Object.fromEntries(idsToClose.map((id) => [id, false])) })));
  });

  const onToggleOpenedID = usePersistFunction((id: string, value = !openedIDs[id]) => {
    setOpenedIDs((prevState) => ({ ...prevState, [id]: value }));
  });

  return {
    openedIDs,
    onDragEnd,
    onDragStart,
    onNestedDragEnd: onDragEnd,
    onToggleOpenedID,
    onNestedDragStart,
  };
};
