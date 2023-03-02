import React from 'react';

import { Base } from './snackbar.component';
import * as I from './snackbar.interface';
import * as S from './snackbar.style';

export const WithOverlay: React.FC<I.WithOverlayProps> = ({ showOverlay = true, ...props }) => (
  <>
    {showOverlay && <S.Overlay />}
    <Base {...props} />
  </>
);
