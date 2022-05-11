import { bind } from '@react-rxjs/core';
import { createKeyedSignal } from '@react-rxjs/utils';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { map, merge, Observable } from 'rxjs';

/*
  TODO: try to replace this with a global emitter + node-specific events re-emitted on the engine
  to see if it results in a more efficient update loop when dragging nodes
  (also adds further decoupling which should reduce the complexity of distributing these updates)
*/

export const useObservableEffect = <T>(source$: Observable<T>, handler: (next: T) => void, dependencies: any[] = []) =>
  React.useEffect(() => {
    const subscription = source$.subscribe(handler);

    return () => subscription.unsubscribe();
  }, dependencies);

type MoveCursorPayload = Pick<Realtime.diagram.awareness.MoveCursorPayload, 'diagramID' | 'creatorID' | 'coords'>;
type CursorPayload = Omit<MoveCursorPayload, 'coords'>;

const getCursorKey = ({ diagramID, creatorID }: CursorPayload): string => [diagramID, creatorID].map(String).join('.');

export const [cursorCoordsChange$, setCursorCoords] = createKeyedSignal<string, MoveCursorPayload, [payload: MoveCursorPayload]>(
  getCursorKey,
  (payload) => payload
);

export const [cursorCoordsHide$, hideCursorCoords] = createKeyedSignal<string, CursorPayload, [payload: CursorPayload]>(
  getCursorKey,
  (payload) => payload
);

const cursorCoordsMerged$ = (param: CursorPayload) => {
  const key = getCursorKey(param);

  return merge(cursorCoordsChange$(key).pipe(map(({ coords }) => coords)), cursorCoordsHide$(key).pipe(map(() => null)));
};

export const [useCursorCoords, cursorCoords$] = bind(cursorCoordsMerged$);
