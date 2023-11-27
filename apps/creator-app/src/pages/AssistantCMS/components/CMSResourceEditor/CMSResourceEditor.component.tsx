import { stopPropagation } from '@voiceflow/ui';
import { Box, Drawer, Table } from '@voiceflow/ui-next';
import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect } from 'react';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { container, content } from './CMSResourceEditor.css';
import type { ICMSResourceEditor } from './CMSResourceEditor.interface';

export const CMSResourceEditor: React.FC<ICMSResourceEditor> = ({ Editor, children }) => {
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const cmsManager = useCMSManager();
  const tableState = Table.useStateMolecule();
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const [activeID, setActiveID] = useAtom(tableState.activeID);
  const resourceSelectors = useAtomValue(cmsManager.selectors);
  const hasResourceItem = useSelector((state) => !!resourceSelectors.oneByID(state, { id: activeID }));

  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

  const onClick = () => navigate.push(getFolderPath());

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
      <div className={content} onClick={stopPropagation()}>
        <Drawer isOpen={!!pathMatch}>
          <Editor key={activeID} />
        </Drawer>
      </div>
    </Box>
  );
};
