/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { BaseModels } from '@voiceflow/base-types';
import { stopPropagation } from '@voiceflow/ui';
import { Box, Drawer, Editor, Table, TabLoader, toast } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai';
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
import { CMSKnowledgeBaseRowActions } from '../CMSKnowledgeBaseRowActions.component';
import { CMSKnowledgeBaseEditorChunks, CMSKnowledgeBaseEditorContent } from './components';

export const CMSKnowledgeBaseEditor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const table = Table.useStateMolecule();
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const routeFolders = useCMSRouteFolders();
  const getAtomValue = useGetAtomValue();
  const setActiveID = useSetAtom(table.activeID);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const { actions } = React.useContext(CMSKnowledgeBaseContext);
  const [kbDocument, setKbDocument] = React.useState<KnowledgeBaseEditorItem | null>(null);
  const [kbDocumentContent, setKbDocumentContent] = React.useState<string | null>(null);
  const [kbDocumentOriginalContnet, setKbDocumentOriginalContent] = React.useState<string | null>(null);
  const [isURL, setIsURL] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isDocumentProcessed = React.useMemo(
    () =>
      kbDocument &&
      kbDocument.status.type !== BaseModels.Project.KnowledgeBaseDocumentStatus.PENDING &&
      kbDocument.status.type !== BaseModels.Project.KnowledgeBaseDocumentStatus.INITIALIZED,
    [kbDocument]
  );

  const loadDocument = async (id: string) => {
    setIsURL(false);
    if (!id) setKbDocument(null);
    setLoading(true);
    const doc = await actions.get(id);
    if (doc?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT && doc.data.canEdit) {
      const fetchedContent = await actions.getContent(doc.documentID);
      setKbDocumentOriginalContent(fetchedContent);
      setKbDocumentContent(fetchedContent);
    }
    setIsURL(doc?.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.URL);
    setKbDocument(doc);
    setLoading(false);
  };

  const onUpdateContent = async () => {
    if (!kbDocumentContent || !kbDocument) return;
    if (kbDocumentContent === kbDocumentOriginalContnet) return;
    await actions.updateContent(kbDocument.documentID, kbDocumentContent);
    actions.sync();
  };

  const onResync = async () => {
    try {
      if (!kbDocument?.documentID) return;
      toast.info('Syncing', { isClosable: false });
      await actions.resync([kbDocument.documentID]);
      toast.success('Synced', { isClosable: false });
    } catch {
      toast.error('Failed to sync data source', { isClosable: false });
    }
  };

  const onDelete = async () => {
    if (kbDocument?.documentID) actions.remove(kbDocument?.documentID);
    setActiveID(null);
    setKbDocument(null);
  };

  React.useEffect(() => {
    if (pathMatch?.params.resourceID && pathMatch?.params.resourceID !== kbDocument?.documentID) {
      loadDocument(pathMatch?.params.resourceID);
    } else if (!pathMatch?.params.resourceID) {
      setActiveID(null);
      setKbDocument(null);
    }
  }, [pathMatch?.params.resourceID]);

  const getFolderPath = () =>
    getAtomValue(routeFolders.activeFolderURL) ?? generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID: versionID || undefined });

  const documentID = kbDocument?.documentID;

  return (
    <Box direction="column" className={container} onClick={() => navigate.push(getFolderPath())}>
      {children}

      <div className={content} onClick={stopPropagation()}>
        <Drawer isOpen={!!pathMatch && isDocumentProcessed !== false}>
          <Editor
            title="Data source"
            readOnly
            headerActions={
              <CMSEditorMoreButton>
                {({ onClose }) =>
                  documentID ? (
                    <CMSKnowledgeBaseRowActions isURL={isURL} documentID={documentID} onDelete={onDelete} onResync={onResync} onClose={onClose} />
                  ) : null
                }
              </CMSEditorMoreButton>
            }
          >
            {loading ? (
              <Box width="100%" height="calc(100vh - 56px - 56px - 57px)">
                <TabLoader variant="dark" />
              </Box>
            ) : (
              <>
                {/* <CMSKnowledgeBaseEditorTags tags={TAGS} onTagsChange={() => {}} /> */}
                {kbDocument?.data && kbDocument?.data.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT && kbDocument.data.canEdit ? (
                  <CMSKnowledgeBaseEditorContent content={kbDocumentContent} setContent={setKbDocumentContent} onUpdateContent={onUpdateContent} />
                ) : (
                  <CMSKnowledgeBaseEditorChunks
                    chunks={kbDocument?.chunks}
                    isDisabled={kbDocument?.status?.type !== BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS}
                  />
                )}
              </>
            )}
          </Editor>
        </Drawer>
      </div>
    </Box>
  );
};
