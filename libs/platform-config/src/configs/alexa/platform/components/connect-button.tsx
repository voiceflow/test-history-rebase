import { Button, useAsyncMountUnmount } from '@voiceflow/ui';
import React from 'react';

import * as Base from '@/configs/base';

import { useContext } from '../context';

export interface Props extends Base.Components.ConnectButton.Props {
  onSuccess: (payload: CodeRequest) => void;
  authOptions: CodeAuthorizeOptions;
}

export const Component: React.FC<Props> = ({ onError, disabled, onSuccess, authOptions, onClick }) => {
  const context = useContext();

  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  const onConnect = async () => {
    try {
      onClick?.();

      const response = await context.amazonAuthorize(authOptions);

      onSuccess(response);
    } catch (err) {
      onError?.(err);
    }
  };

  useAsyncMountUnmount(async () => {
    try {
      await context.amazonInitialize();

      setScriptLoaded(true);
    } catch {
      onError?.(new Error('Something went wrong'));
    }
  });

  return (
    <Button
      variant={Button.Variant.PRIMARY}
      className="LoginWithAmazon"
      onClick={onConnect}
      disabled={!scriptLoaded || disabled}
    >
      Connect Amazon
    </Button>
  );
};

export const CONFIG = Base.Components.ConnectButton.extend({
  Component,
})(Base.Components.ConnectButton.validate);

export type Config = typeof CONFIG;
