import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { Button } from '@voiceflow/ui';
import React from 'react';

export interface Props {
  onError?: (error: unknown) => void;
  onClick?: VoidFunction;
  disabled?: boolean;
  onSuccess: (result: any) => void;
}

export interface Config {
  Component: React.FC<Props>;
}

export const Component: React.FC<Props> = () => (
  <Button variant={Button.Variant.PRIMARY} disabled>
    Connect
  </Button>
);

export const CONFIG = Types.satisfies<Config>()({
  Component: () => null,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
