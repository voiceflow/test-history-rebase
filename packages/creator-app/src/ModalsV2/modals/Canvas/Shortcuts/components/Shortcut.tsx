import { Flex } from '@voiceflow/ui';
import React from 'react';

import { ShortcutContainer, ShortcutTitle } from '../styles';

export interface ShortcutProps {
  title: string;
  command: React.ReactNode;
}

const Shortcut: React.FC<ShortcutProps> = ({ command, title }) => (
  <ShortcutContainer>
    <ShortcutTitle>{title}</ShortcutTitle>

    <Flex gap={4}>{command}</Flex>
  </ShortcutContainer>
);

export default Shortcut;
