import { Box, forwardRef, HotKeys, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { IFolderMenuRootItem } from './FolderMenu.interface';

export const FolderMenuRootItem = forwardRef<HTMLDivElement, IFolderMenuRootItem>('FolderMenuRootItem')(
  ({ name, index, scope, isLast, onClick, searchValue }, ref) => {
    const cmsResourcesSize = useSelector((state) => Designer.utils.getCMSResourceCountSelector(scope)(state));

    return (
      <Box ref={ref} direction="column">
        <Menu.Item
          label={name}
          onClick={() => onClick()}
          hotKeys={<HotKeys hotKeys={[{ label: String(cmsResourcesSize) }]} />}
          data-index={index}
          searchValue={searchValue}
        />

        {!isLast && <Menu.Divider />}
      </Box>
    );
  }
);
