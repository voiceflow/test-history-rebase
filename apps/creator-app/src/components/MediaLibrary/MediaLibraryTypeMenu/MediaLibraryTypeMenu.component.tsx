import { Menu } from '@voiceflow/ui-next';
import React from 'react';

import { MediaType } from '../MediaLibrary.enum';
import type { IMediaLibraryTypeMenu } from './MediaLibraryTypeMenu.interface';

export const MediaLibraryTypeMenu: React.FC<IMediaLibraryTypeMenu> = ({ width = 151, onTypeSelect }) => (
  <Menu width={width}>
    <Menu.Item label="Image" onClick={() => onTypeSelect(MediaType.IMAGE)} />
    <Menu.Item label="Card(s)" onClick={() => onTypeSelect(MediaType.CARD)} />
    {/* <MenuItem label="Video" onClick={() => onTypeSelect()} /> */}
  </Menu>
);
