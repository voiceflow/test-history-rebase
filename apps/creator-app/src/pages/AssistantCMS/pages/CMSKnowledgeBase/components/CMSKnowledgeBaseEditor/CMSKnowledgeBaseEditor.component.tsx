/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { BaseModels } from '@voiceflow/base-types';
import { stopPropagation } from '@voiceflow/ui';
import { Box, Drawer, Editor } from '@voiceflow/ui-next';
import { atom } from 'jotai';
import React from 'react';
import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { container, content } from '@/pages/AssistantCMS/components/CMSResourceEditor/CMSResourceEditor.css';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';
import { KnowledgeBaseContext, KnowledgeBaseEditorItem } from '@/pages/KnowledgeBase/context';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { PATH_NAME } from '../../CMSKnowledgeBase.constant';
import { CMSKnowledgeBaseEditorChunks, CMSKnowledgeBaseEditorContent } from './components';

const CONTENT = `Trusted by 100,000 teams building AI agents across every channel and use case. Design platform. Build for scale and complexity, easily. Voiceflow is world's most advanced agent design platform - allowing teams of any size to build agents of any scale and complexity.`;

export const CMSKnowledgeBaseEditor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const routeFolders = useCMSRouteFolders();
  const getAtomValue = useGetAtomValue();
  const versionID = atom(useSelector(Session.activeVersionIDSelector));
  const { state, actions } = React.useContext(KnowledgeBaseContext);
  const [kbDocument, setKbDocument] = React.useState<KnowledgeBaseEditorItem | null>(null);

  const loadDocument = async () => {
    if (!state.activeDocumentID) return;
    const doc = await Promise.resolve(actions.get(state.activeDocumentID));
    setKbDocument(doc);
  };

  React.useEffect(() => {
    loadDocument();
  }, [state.activeDocumentID]);

  const url = atom((get) => generatePath(get(PATH_NAME), { versionID: get(versionID) || undefined }));
  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(url);

  return (
    <Box direction="column" className={container} onClick={() => navigate.push(getFolderPath())}>
      {children}
      {state.editorOpen && kbDocument && (
        <div className={content} onClick={stopPropagation()}>
          <Drawer isOpen={!!pathMatch}>
            <Editor
              title="Data Source"
              headerActions={
                <CMSEditorMoreButton
                  options={[{ label: 'Remove', onClick: () => (kbDocument.documentID ? actions.remove(kbDocument.documentID) : {}) }]}
                />
              }
            >
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
