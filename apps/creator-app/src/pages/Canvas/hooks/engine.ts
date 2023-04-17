import { useMouseMove } from '@voiceflow/ui';
import moize from 'moize';
import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { IS_DEVELOPMENT } from '@/config';
import { MousePositionContext } from '@/contexts/MousePositionContext';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useForceUpdate } from '@/hooks';
import { CanvasAction } from '@/pages/Canvas/constants';
import { Store } from '@/store/types';
import { Coords } from '@/utils/geometry';

import Engine from '../engine';

const createEngine = moize((...args: ConstructorParameters<typeof Engine>) => new Engine(...args));

// used only in the HMR
let $recreateEngine: ((Class: typeof Engine) => void) | null = null;

const useCreateEngine = (options?: { isExport?: boolean }): [Engine, number] => {
  const store = useStore() as Store;
  const [forceUpdate, engineKey] = useForceUpdate();
  const mousePosition = React.useContext(MousePositionContext);

  const ref = React.useRef<Engine>();

  if (ref.current === undefined) {
    ref.current = createEngine(store, { ...options, mousePosition });

    $recreateEngine = (Class: typeof Engine) => {
      ref.current = new Class(store, { ...options, mousePosition });
      forceUpdate();
    };
  }

  return [ref.current, engineKey];
};

export const useEngine = (options?: { isExport?: boolean }): [Engine, number] => {
  const diagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const [engine, engineKey] = useCreateEngine(options);

  useMouseMove((event) => engine.emitter.emit(CanvasAction.MOVE_MOUSE, new Coords([event.clientX, event.clientY])), [engine]);

  React.useEffect(
    () => () => {
      engine.reset();
      createEngine.clear();
    },
    [diagramID]
  );

  return [engine, engineKey];
};

if (IS_DEVELOPMENT && import.meta.hot) {
  import.meta.hot.accept('../engine/index.ts', (module) => {
    if (module) {
      $recreateEngine?.(module.default);
    }
  });
}
