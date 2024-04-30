import type React from 'react';

import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

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
