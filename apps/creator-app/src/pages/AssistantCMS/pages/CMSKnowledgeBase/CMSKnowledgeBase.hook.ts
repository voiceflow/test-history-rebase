import { Table, usePersistFunction } from '@voiceflow/ui-next';
import { useAtom } from 'jotai';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export const useKBDocumentSync = () => {
  const { actions } = React.useContext(CMSKnowledgeBaseContext);
  const timeoutRef = React.useRef<number | null>(null);

  const start = React.useCallback(() => {
    if (timeoutRef.current !== null) return;

    const sync = () => {
      actions.sync();

      timeoutRef.current = window.setTimeout(() => sync(), 5000);
    };

    sync();
  }, []);

  const cancel = React.useCallback(() => {
    if (timeoutRef.current === null) return;

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  React.useEffect(() => {
    actions.sync();

    return cancel;
  }, []);

  return { start, cancel, scheduled: timeoutRef.current !== null };
};

export const useCMSKnowledgeBaseRowItemClick = () => {
  const table = Table.useStateMolecule();
  const onLinkClick = useOnLinkClick();
  const [activeID, setActiveID] = useAtom(table.activeID);
  const versionID = useSelector(Session.activeVersionIDSelector);

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const basePath = generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID: versionID || undefined });

    if (resourceID === activeID) {
      setActiveID(null);
      onLinkClick(`${basePath}`)(event);
    } else {
      setActiveID(resourceID);
      onLinkClick(`${basePath}/${resourceID}`)(event);
    }
  });
};
