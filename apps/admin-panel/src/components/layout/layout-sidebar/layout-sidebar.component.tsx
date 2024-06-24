'use client';

import ClearIcon from '@mui/icons-material/Clear';
import { AppBar, Box, Drawer, IconButton, InputBase, Toolbar, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useParams, useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useState } from 'react';

import { VIEW_GROUP } from '@/views/views.constant';

export const LayoutSidebar = () => {
  const WIDTH = 240;

  const router = useRouter();
  const params = useParams<{ group?: string; view?: string }>();
  const [search, setSearch] = useState('');

  const deferredSearch = useDeferredValue(search);

  const onItemFocus = (event: React.SyntheticEvent | null, itemID: string) => {
    if (!itemID.includes('/')) return;

    if (event && 'metaKey' in event && event.metaKey) {
      window.open(`/view/${itemID}`);
    } else {
      router.push(`/view/${itemID}`);
    }
  };

  const treeContent = useMemo(() => {
    const transformedSearch = deferredSearch.toLowerCase().trim();
    const searchTags = transformedSearch.split(' ');

    const result: React.ReactNode[] = [];

    for (const [key, group] of Object.entries(VIEW_GROUP)) {
      const groupResult: React.ReactNode[] = [];

      for (const [viewKey, view] of Object.entries(group.views)) {
        if (
          !transformedSearch ||
          view.name.toLowerCase().includes(transformedSearch) ||
          searchTags.every((tag) => view.tags.some((viewTag) => viewTag.includes(tag)))
        ) {
          groupResult.push(<TreeItem key={`${key}/${viewKey}`} label={view.name} itemId={`${key}/${viewKey}`} />);
        }
      }

      if (groupResult.length) {
        result.push(
          <TreeItem key={key} itemId={key} label={group.name}>
            {groupResult}
          </TreeItem>
        );
      }
    }

    return result;
  }, [deferredSearch]);

  const defaultExpandedItems = useMemo(() => Object.keys(VIEW_GROUP), []);

  return (
    <Drawer
      sx={{
        width: WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box' },
      }}
      variant="permanent"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VF Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={1} overflow="auto">
        <Box display="flex" mb={1} alignItems="center">
          <InputBase
            sx={{ mr: 1, flex: 1, pl: 1 }}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search "
          />

          {search && (
            <IconButton size="small" onClick={() => setSearch('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <SimpleTreeView
          onItemFocus={onItemFocus}
          selectedItems={`${params.group}/${params.view}`}
          disableSelection
          defaultExpandedItems={defaultExpandedItems}
        >
          {treeContent}
        </SimpleTreeView>
      </Box>
    </Drawer>
  );
};
