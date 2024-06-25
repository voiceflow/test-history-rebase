import type { IHotKey } from '@voiceflow/ui-next';
import { Icon, Text, Tokens } from '@voiceflow/ui-next';
import React, { Fragment } from 'react';

import { iconStyle } from './TipHotkey.css';
interface ITipHotkey {
  hotkeys: IHotKey[];
}

export const TipHotkey: React.FC<ITipHotkey> = ({ hotkeys }) => (
  <Text as="span" color={Tokens.colors.black[100]}>
    {hotkeys.map((hotkey, index) => (
      <Fragment key={index}>
        {hotkey.iconName && <Icon style={{ fontSize: 20 }} name={hotkey.iconName} className={iconStyle} />}
        {hotkey.label}
      </Fragment>
    ))}
  </Text>
);
