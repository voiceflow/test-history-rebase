/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { BaseModels } from '@voiceflow/base-types';
import type { IconName } from '@voiceflow/icons';
import { stopPropagation } from '@voiceflow/ui';
import { Box, Drawer, Editor, toast } from '@voiceflow/ui-next';
import React from 'react';
import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { container, content } from '@/pages/AssistantCMS/components/CMSResourceEditor/CMSResourceEditor.css';
import { CMSKnowledgeBaseContext, KnowledgeBaseEditorItem } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { CMSKnowledgeBaseEditorChunks, CMSKnowledgeBaseEditorContent } from './components';

const CONTENT = `Trusted by 100,000 teams building AI agents across every channel and use case. Design platform. Build for scale and complexity, easily. Voiceflow is world's most advanced agent design platform - allowing teams of any size to build agents of any scale and complexity.`;

export const CMSKnowledgeBaseEditor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const routeFolders = useCMSRouteFolders();
  const getAtomValue = useGetAtomValue();
  const versionID = useSelector(Session.activeVersionIDSelector);
  const { state, actions } = React.useContext(CMSKnowledgeBaseContext);
  const [kbDocument, setKbDocument] = React.useState<KnowledgeBaseEditorItem | null>(null);

  const isDocumentProcessed = React.useMemo(
    () =>
      kbDocument &&
      kbDocument.status.type !== BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING &&
      kbDocument.status.type !== BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED,
    [kbDocument]
  );

  const loadDocument = async () => {
    if (!state.activeDocumentID) return;
    const doc = await actions.get(state.activeDocumentID);

    setKbDocument(doc);
  };

  const onResync = async () => {
    try {
      toast.info('Syncing data sources', { isClosable: false });
      await actions.resync([state.activeDocumentID!]);
      toast.success('Data source synced', { isClosable: false });
    } catch {
      toast.error('Failed to sync data source', { isClosable: false });
    }
  };

  React.useEffect(() => {
    loadDocument();
  }, [state.activeDocumentID]);

  const getFolderPath = () =>
    getAtomValue(routeFolders.activeFolderURL) ?? generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID: versionID || undefined });

  const baseOptions = [
    { label: 'Remove', prefixIcon: 'Trash' as IconName, onClick: () => (kbDocument?.documentID ? actions.remove(kbDocument.documentID) : {}) },
  ];
  const options =
    kbDocument?.data.type === BaseModels.Project.KnowledgeBaseDocumentType.URL
      ? [
          {
            label: 'Re-sync',
            prefixIcon: 'Sync' as IconName,
            onClick: onResync,
          },
          ...baseOptions,
        ]
      : baseOptions;

  return (
    <Box direction="column" className={container} onClick={() => navigate.push(getFolderPath())}>
      {children}
      {state.editorOpen && isDocumentProcessed && (
        <div className={content} onClick={stopPropagation()}>
          <Drawer isOpen={!!pathMatch}>
            <Editor title="Data Source" headerActions={<CMSEditorMoreButton options={options} />}>
              {/* <CMSKnowledgeBaseEditorTags tags={TAGS} onTagsChange={() => {}} /> */}
              {kbDocument?.data && kbDocument?.data.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT ? (
                <CMSKnowledgeBaseEditorContent content={CONTENT} onContentChange={() => {}} />
              ) : (
                <CMSKnowledgeBaseEditorChunks chunks={kbDocument?.chunks} />
              )}
            </Editor>
          </Drawer>
        </div>
      )}
    </Box>
  );
};
