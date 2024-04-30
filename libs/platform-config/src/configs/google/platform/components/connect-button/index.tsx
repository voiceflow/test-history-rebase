import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import * as Base from '@/configs/base';

import { useContext } from '../../context';
import * as S from './style';

export interface Props extends Base.Components.ConnectButton.Props {
  scopes: string[];
  onSuccess: (payload: { code: string }) => void;
}

export const Component: React.FC<Props> = ({ scopes, onError, onClick, disabled, onSuccess }) => {
  const context = useContext();

  const onConnect = async () => {
    try {
      onClick?.();

      const code = await context.googleAuthorize(scopes);

      onSuccess({ code });
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <S.Button className="LoginWithGoogle" onClick={onConnect} disabled={disabled}>
      <SvgIcon icon="connectGoogle" size={46} />
      <Text fontWeight={600}>Sign in with Google</Text>
    </S.Button>
  );
};

export const CONFIG = Base.Components.ConnectButton.extend({
  Component,
})(Base.Components.ConnectButton.validate);

export type Config = typeof CONFIG;
