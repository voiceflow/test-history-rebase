import React from 'react';

import * as Session from '@/ducks/session';
import { useLocalStorageState, useRAF, useSelector } from '@/hooks';

export interface OpenedIDsToggleApi {
  openedIDs: Record<string, boolean>;
  onDragEnd: VoidFunction;
  onDragStart: VoidFunction;
  onToggleOpenedID: (topicID: string) => void;
}

export const useOpenedIDsToggle = (name: string): OpenedIDsToggleApi => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [openedIDs, setOpenedIDs] = useLocalStorageState<Record<string, boolean>>(`dm-opened-${name}.${activeProjectID}`, {});

  const [scheduler, schedulerApi] = useRAF();
  const openedIDsCache = React.useRef(openedIDs);

  const onDragEnd = React.useCallback(() => {
    schedulerApi.current.cancel();

    setOpenedIDs({ ...openedIDsCache.current });
  }, [openedIDs]);

  const onDragStart = React.useCallback(() => {
    openedIDsCache.current = openedIDs;

    scheduler(() => {
      setOpenedIDs({});
    });
  }, [openedIDs]);

  const onToggleOpenedID = React.useCallback(
    (topicID: string) => {
      setOpenedIDs({ ...openedIDs, [topicID]: !openedIDs[topicID] });
    },
    [openedIDs]
  );

  return {
    openedIDs,
    onDragEnd,
    onDragStart,
    onToggleOpenedID,
  };
};
