import { Nullable } from '@voiceflow/common';
import { useCache } from '@voiceflow/ui';
import React from 'react';
import { ConnectDropTarget, useDrop } from 'react-dnd';

/* This hook doesn't do anything functional,
 * but it prevents the awful lag when dropping steps back onto the step menu
 */
export const useDropLagFix = (accept: string | string[]): ConnectDropTarget => {
  const [, dropRef] = useDrop({ accept });

  React.useEffect(
    () => () => {
      dropRef(null);
    },
    [dropRef]
  );

  return dropRef;
};

interface DnDReorderProps<Key, Item> {
  getID: (item: Item) => Key;
  onPersist: (fromID: Key, toIndex: number) => void;
  onReorder: (fromID: Key, toIndex: number) => void;
}

export const useDnDReorder = <Key, Item>({ getID, onPersist, onReorder: onReorderProp }: DnDReorderProps<Key, Item>) => {
  const fromIDRef = React.useRef<Nullable<Key>>(null);
  const toIndexRef = React.useRef<Nullable<number>>(null);

  const cache = useCache({ getID, onPersist, onReorder: onReorderProp });

  const onStart = React.useCallback((item: Item) => {
    fromIDRef.current = cache.current.getID(item);
  }, []);

  const onEnd = React.useCallback(() => {
    if (fromIDRef.current !== null && toIndexRef.current !== null) {
      cache.current.onPersist(fromIDRef.current, toIndexRef.current);
    }

    fromIDRef.current = null;
    toIndexRef.current = null;
  }, []);

  const onReorder = React.useCallback((_: number, toIndex: number) => {
    toIndexRef.current = toIndex;

    if (!fromIDRef.current) return;

    cache.current.onReorder(fromIDRef.current, toIndex);
  }, []);

  return { onStart, onEnd, onReorder };
};
