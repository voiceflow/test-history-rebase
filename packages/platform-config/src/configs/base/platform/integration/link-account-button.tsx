import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import React from 'react';

import { ConnectButton } from '../components';

export interface Props extends ConnectButton.Props {}

export interface Config {
  Component: React.FC<Props>;
}

export const CONFIG = Types.satisfies<Config>()({
  Component: ConnectButton.Component,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
