import { Menu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import { MediaType } from '../MediaLibrary.enum';
import type { IMediaLibraryTypeMenu } from './MediaLibraryTypeMenu.interface';

export const MediaLibraryTypeMenu: React.FC<IMediaLibraryTypeMenu> = ({ width = 151, onTypeSelect }) => (
  <Menu width={width}>
    <MenuItem label="Image" onClick={() => onTypeSelect(MediaType.IMAGE)} />
    <MenuItem label="Card(s)" onClick={() => onTypeSelect(MediaType.CARD)} />
    {/* <MenuItem label="Video" onClick={() => onTypeSelect()} /> */}
  </Menu>
);
