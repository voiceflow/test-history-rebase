import React from 'react';

import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';

const NLUQuickViewRoute: React.FC = () => {
  const nluQuickViewModal = ModalsV2.useModal(ModalsV2.NLU.QuickView);

  const creatorFocus = useSelector(Creator.creatorFocusSelector);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentCanvasNode = useDispatch(Router.goToCurrentCanvasNode);

  React.useEffect(() => {
    nluQuickViewModal.open();

    return () => {
      nluQuickViewModal.close();
    };
  }, []);

  React.useEffect(() => {
    if (!nluQuickViewModal.rendered) return () => {};

    return () => {
      if (creatorFocus.target && creatorFocus.isActive) {
        goToCurrentCanvasNode(creatorFocus.target);
      } else {
        goToCurrentCanvas();
      }
    };
  }, [nluQuickViewModal.rendered]);

  return null;
};

export default NLUQuickViewRoute;
