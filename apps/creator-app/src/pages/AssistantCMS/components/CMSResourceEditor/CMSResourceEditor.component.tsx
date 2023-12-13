import { stopPropagation } from '@voiceflow/ui';
import { Box, Drawer, Table, usePersistFunction } from '@voiceflow/ui-next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useHotkeyList } from '@/hooks/hotkeys';
import { useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { container, content, drawer } from './CMSResourceEditor.css';
import type { ICMSResourceEditor } from './CMSResourceEditor.interface';

export const CMSResourceEditor: React.FC<ICMSResourceEditor> = ({ Editor, children, drawerNode }) => {
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const cmsManager = useCMSManager();
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const setDrawerNode = useSetAtom(drawerNode);
  const resourceSelectors = useAtomValue(cmsManager.selectors);
  const [activeID, setActiveID] = useAtom(tableState.activeID);

  const hasResourceItem = useSelector((state) => !!resourceSelectors.oneByID(state, { id: activeID }));

  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

  const onClick = () => navigate.push(getFolderPath());

  useEffect(() => {
    setActiveID(pathMatch?.params.resourceID ?? null);
  }, [pathMatch]);

  useHotkeyList([
    {
      hotkey: 'up',
      callback: usePersistFunction(() => {
        if (!activeID) return;

        const resources = getAtomValue(cmsManager.dataToRender).map((atom) => getAtomValue(atom));

        if (resources.length <= 1) return;

        const currentIndex = resources.findIndex((resource) => resource.id === activeID);

        if (currentIndex === -1) {
          return;
        }

        const nextIndex = currentIndex - 1;

        if (nextIndex < 0) {
          navigate.push(`${getFolderPath()}/${resources[resources.length - 1].id}`);
        } else {
          navigate.push(`${getFolderPath()}/${resources[nextIndex].id}`);
        }
      }),
    },
    {
      hotkey: 'down',
      callback: usePersistFunction(() => {
        if (!activeID) return;

        const resources = getAtomValue(cmsManager.dataToRender).map((atom) => getAtomValue(atom));

        if (resources.length <= 1) return;

        const currentIndex = resources.findIndex((resource) => resource.id === activeID);

        if (currentIndex === -1) {
          return;
        }

        const nextIndex = currentIndex + 1;

        if (nextIndex >= resources.length) {
          navigate.push(`${getFolderPath()}/${resources[0].id}`);
        } else {
          navigate.push(`${getFolderPath()}/${resources[nextIndex].id}`);
        }
      }),
    },
  ]);

  if (pathMatch && pathMatch.params.resourceID === activeID && !hasResourceItem) {
    return <Redirect to={getFolderPath()} />;
  }

  return (
    <Box direction="column" className={container} onClick={onClick}>
      {children}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={content} onClick={stopPropagation()}>
        <Drawer isOpen={!!pathMatch} className={drawer}>
          <div ref={setDrawerNode}>
            <Editor key={activeID} />
          </div>
        </Drawer>
      </div>
    </Box>
  );
};
