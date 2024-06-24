import { CircularProgress } from '@mui/material';
import type { Loader } from 'next/dynamic';
import dynamic from 'next/dynamic';

interface View {
  name: string;

  // tags are used to filter/search views
  tags: string[];

  component: React.ComponentType;
}

interface ViewGroup {
  name: string;

  views: Record<string, View>;
}

const lazy = (loader: Loader) => dynamic(loader, { loading: () => <CircularProgress /> });

export const VIEW_GROUP: Record<string, ViewGroup> = {
  // workspace views
  workspace: {
    name: 'Workspace',
    views: {
      'decode-id': {
        name: 'Decode ID',
        tags: ['workspace', 'decode'],
        component: lazy(() => import('@/views/workspace/decode-workspace-id.view')),
      },
      'encode-id': {
        name: 'Encode ID',
        tags: ['workspace', 'encode'],
        component: lazy(() => import('@/views/workspace/encode-workspace-id.view')),
      },
    },
  },
};
