import React from 'react';

import { useSnackbar } from './hooks';
import * as S from './styles';
import Text from './Text';
import * as SnackbarTypes from './types';

export const RECONNECT_TIMEOUT = 10;
export { SnackbarTypes };

interface SnackbarProps extends SnackbarTypes.InstanceProps, React.PropsWithChildren {
  showOverlay?: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({ isOpen, children, showOverlay }) => {
  if (!isOpen) return null;

  return (
    <>
      {showOverlay && <S.Overlay />}
      <S.BarWrapper>
        <S.Snackbar>{children}</S.Snackbar>
      </S.BarWrapper>
    </>
  );
};

export default Object.assign(Snackbar, {
  useSnackbar,
  DarkButton: S.DarkButton,
  PrimaryButton: S.PrimaryButton,
  Text,
  Icon: S.Icon,
  ClickableBody: S.ClickableBody,
});
