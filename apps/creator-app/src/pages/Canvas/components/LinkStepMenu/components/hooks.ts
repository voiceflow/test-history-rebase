import React from 'react';

import { useTheme } from '@/hooks';
import type { LinkStepMenuValue } from '@/pages/Canvas/contexts';
import { EngineContext, LinkStepMenuContext } from '@/pages/Canvas/contexts';
import type Engine from '@/pages/Canvas/engine';
import type { Coords } from '@/utils/geometry';

const BLOCK_HEADER_HEIGHT = 50.5;

export const useOnCreate = (
  create: (options: { engine: Engine; coords: Coords; stepMenu: LinkStepMenuValue }) => Promise<void>
) => {
  const engine = React.useContext(EngineContext)!;
  const stepMenu = React.useContext(LinkStepMenuContext)!;

  const theme = useTheme();

  return async () => {
    if (!stepMenu.nodePosition) return;

    const coords = stepMenu.nodePosition
      .sub([0, (theme.components.blockStep.minHeight + BLOCK_HEADER_HEIGHT) / 2])
      .add([theme.components.block.width / 2, 0]);

    await create({ coords, engine, stepMenu });
  };
};
