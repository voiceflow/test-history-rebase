import { Box, Drawer, Table } from '@voiceflow/ui-next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useGetAtomValue } from '@/hooks/atom.hook';
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

  const onClick = (event: React.MouseEvent<HTMLDivElement> & { __editorClick?: boolean }) => {
    if (event.__editorClick) return;

    navigate.push(getFolderPath());
  };

  const onContentClick = (event: React.MouseEvent<HTMLDivElement> & { __editorClick?: boolean }) => {
    Object.assign(event, { __editorClick: true });
  };

  useEffect(() => {
    setActiveID(pathMatch?.params.resourceID ?? null);
  }, [pathMatch]);

  if (pathMatch && pathMatch.params.resourceID === activeID && !hasResourceItem) {
    return <Redirect to={getFolderPath()} />;
  }

  return (
    <Box direction="column" className={container} onClick={onClick}>
      {children}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={content} onClick={onContentClick}>
        <Drawer isOpen={!!pathMatch} className={drawer}>
          <div ref={setDrawerNode}>
            <Editor key={activeID} />
          </div>
        </Drawer>
      </div>
    </Box>
  );
};
