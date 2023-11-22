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
import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { PATH_NAME } from '../../CMSKnowledgeBase.constant';
import { CMSKnowledgeBaseEditorChunks, CMSKnowledgeBaseEditorContent, CMSKnowledgeBaseEditorTags } from './components';

const CHUNKS = [
  `Trusted by 100,000 teams building AI agents across every channel and use case. Design platform. Build for scale and complexity, easily. Voiceflow is world's most advanced agent design platform - allowing teams of any size to build agents of any scale and complexity.`,
  'Voiceflow, users were no longer led through fixed linear flows. They were engaged with a real experience, using natural language, which revealed true-to-life results.',
  'Voiceflow is a platform for building conversational AI agents. It allows teams to collaboratively design, test, and launch agents across channels through an interactive workspace. Some key items include: teams can work together on agent data in one place, eliminating silos, high-fidelity prototypes can be quickly created and shared, analytics help understand agent performance and drive improvements. Agents can be launched to any interface using ',
];
const TAGS = ['tag1', 'tag2', 'tag3'];
const CONTENT = `Trusted by 100,000 teams building AI agents across every channel and use case. Design platform. Build for scale and complexity, easily. Voiceflow is world's most advanced agent design platform - allowing teams of any size to build agents of any scale and complexity.`;

export const CMSKnowledgeBaseEditor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useHistory();
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);
  const routeFolders = useCMSRouteFolders();
  const getAtomValue = useGetAtomValue();

  const { state, actions } = React.useContext(KnowledgeBaseContext);
  const documentID = state.activeDocumentID;
  const document = state.documents.find((doc) => doc.id === documentID);

  const versionID = atom(useSelector(Session.activeVersionIDSelector));
  const url = atom((get) => generatePath(get(PATH_NAME), { versionID: get(versionID) || undefined }));
  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(url);

  return (
    <Box direction="column" className={container} onClick={() => navigate.push(getFolderPath())}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={content} onClick={stopPropagation()}>
        <Drawer isOpen={!!pathMatch}>
          <Editor
            title="Data Source"
            headerActions={<CMSEditorMoreButton options={[{ label: 'Remove', onClick: () => (documentID ? actions.remove(documentID) : {}) }]} />}
          >
            <CMSKnowledgeBaseEditorTags tags={TAGS} onTagsChange={() => {}} />
            {document?.data && document?.data.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT ? (
              <CMSKnowledgeBaseEditorContent content={CONTENT} onContentChange={() => {}} />
            ) : (
              <CMSKnowledgeBaseEditorChunks chunks={CHUNKS} />
            )}
          </Editor>
        </Drawer>
      </div>
    </Box>
  );
};
