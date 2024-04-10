import { Box, Drawer, Table } from '@voiceflow/ui-next';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useContext, useEffect } from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { generatePath, Redirect, useRouteMatch } from 'react-router-dom';

import * as Session from '@/ducks/session';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';
import { useHideVoiceflowAssistant } from '@/hooks/voiceflowAssistant';

import { useCMSManager } from '../../contexts/CMSManager';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';
import { container, content, drawer } from './CMSResourceEditor.css';
import type { ICMSResourceEditor } from './CMSResourceEditor.interface';

export const CMSResourceEditor: React.FC<ICMSResourceEditor> = ({ Editor, children, drawerNode }) => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const pathMatch = useRouteMatch<{ resourceID: string; resourceType?: string }>();
  const cmsManager = useCMSManager();
  const tableState = Table.useStateMolecule();
  const onLinkClick = useOnLinkClick();
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const setDrawerNode = useSetAtom(drawerNode);
  const dismissableLayer = useContext(DismissableLayerContext);
  const resourceSelectors = useAtomValue(cmsManager.selectors);
  const folderID = useAtomValue(cmsManager.folderID);
  const [activeID, setActiveID] = useAtom(tableState.activeID);

  const hasResourceItem = useSelector((state) => !!resourceSelectors.oneByID(state, { id: activeID }));

  const getFolderPath = () => getAtomValue(routeFolders.activeFolderPathname);

  const onClick = (event: React.MouseEvent<HTMLDivElement> & { __editorClick?: boolean }) => {
    if (event.__editorClick) return;

    dismissableLayer.dismissAllGlobally();
    onLinkClick(getFolderPath(), { ignoreMetaKey: true })(event);
  };

  const onContentClick = (event: React.MouseEvent<HTMLDivElement> & { __editorClick?: boolean }) => {
    Object.assign(event, { __editorClick: true });
  };

  useHideVoiceflowAssistant({ hide: !!pathMatch?.params.resourceID });

  useEffect(() => {
    setActiveID(pathMatch?.params.resourceID ?? null);
  }, [pathMatch]);

  if (pathMatch.params.resourceID && pathMatch.params.resourceID === activeID && !hasResourceItem && versionID) {
    return <Redirect to={generatePath(getFolderPath(), { versionID, folderID: folderID ?? undefined })} />;
  }

  return (
    <Box direction="column" className={container} onClick={onClick}>
      {children}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={content} onClick={onContentClick}>
        <Drawer isOpen={!!pathMatch.params.resourceID} className={drawer}>
          <div ref={setDrawerNode}>
            <Editor key={activeID} />
          </div>
        </Drawer>
      </div>
    </Box>
  );
};
