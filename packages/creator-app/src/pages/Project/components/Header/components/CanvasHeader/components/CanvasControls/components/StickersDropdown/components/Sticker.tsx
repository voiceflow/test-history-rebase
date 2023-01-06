import { useCache } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { BlockType } from '@/constants';
import * as History from '@/ducks/history';
import { useDispatch, useEventualEngine, usePermission } from '@/hooks';

import { stickerSize } from '../constants';
import Image, { StickerProps } from './Image';
import ImageContainer from './ImageContainer';

const Sticker: React.OldFC<StickerProps> = ({ url }) => {
  const getEngine = useEventualEngine();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const cache = useCache({ getEngine, canEditCanvas });

  const transaction = useDispatch(History.transaction);

  const onClick = React.useCallback(async () => {
    if (!cache.current.canEditCanvas) return;

    const engine = cache.current.getEngine()!;

    await transaction(async () => {
      if (!engine.canvas) return;

      const rect = engine.canvas.getRect();
      const zoom = engine.canvas.getZoom();
      const [x, y] = engine.canvas.getPosition();
      const offsetX = 0 - x / zoom + (rect.width / zoom - stickerSize) / 2;
      const offsetY = 0 - y / zoom + (rect.height / zoom - stickerSize) / 2;

      await engine.node.add(BlockType.MARKUP_IMAGE, engine.canvas.toCoords([offsetX, offsetY]), {
        url,
        width: stickerSize,
        height: stickerSize,
        rotate: 0,
      });
    });
  }, [url, getEngine]);

  return (
    <ImageContainer>
      <Image url={url} onClick={onClick} />
    </ImageContainer>
  );
};

export default Sticker;
