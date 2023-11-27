import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

export const useKBDocumentSync = () => {
  const { actions } = React.useContext(KnowledgeBaseContext);
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
  const onLinkClick = useOnLinkClick();
  const { actions, state } = React.useContext(KnowledgeBaseContext);
  const versionID = useSelector(Session.activeVersionIDSelector);

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (resourceID === state.activeDocumentID) {
      actions.setEditorOpen(!state.editorOpen);
    } else {
      actions.setActiveDocumentID(resourceID);
      actions.setEditorOpen(true);

      const basePath = generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID: versionID || undefined });

      onLinkClick(`${basePath}/${resourceID}`)(event);
    }
  });
};
