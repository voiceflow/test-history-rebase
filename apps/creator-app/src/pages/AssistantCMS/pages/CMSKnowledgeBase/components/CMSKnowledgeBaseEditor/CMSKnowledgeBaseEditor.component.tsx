import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, Editor, TabLoader, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { pendingStatusSet } from '../../CMSKnowledgeBase.constants';
import { CMSKnowledgeBaseRowActions } from '../CMSKnowledgeBaseRowActions/CMSKnowledgeBaseRowActions.component';
import { CMSKnowledgeBaseEditorChunks } from './CMSKnowledgeBaseEditorChunks/CMSKnowledgeBaseEditorChunks.component';
import { CMSKnowledgeBaseEditorContent } from './CMSKnowledgeBaseEditorContent/CMSKnowledgeBaseEditorContent.component';

export const CMSKnowledgeBaseEditor: React.FC = () => {
  const documentID = useCMSActiveResourceID();

  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id: documentID });

  const getDocument = useDispatch(Designer.KnowledgeBase.Document.effect.getOne);
  const replaceDocument = useDispatch(Designer.KnowledgeBase.Document.effect.replaceTextDocument);
  const getDocumentData = useDispatch(Designer.KnowledgeBase.Document.effect.getOneBlobData);

  const documentStatusRef = React.useRef(document?.status);

  const [loading, setLoading] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState<string | null>(null);
  const [documentOriginalContent, setDocumentOriginalContent] = React.useState<string | null>(null);

  const onUpdateContent = async () => {
    if (!document || !documentContent || documentContent === documentOriginalContent) return;

    await replaceDocument(documentID, documentContent);
  };

  const fetchDocument = usePersistFunction(async (signal: { cancelled: boolean }) => {
    setLoading(true);

    const newDocument = await getDocument(documentID);

    if (signal.cancelled) return;

    if (newDocument.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT && newDocument.data.canEdit) {
      const fetchedContent = await getDocumentData(documentID);
      const content = await fetchedContent.blob.text();

      if (signal.cancelled) return;

      setDocumentContent(content);
      setDocumentOriginalContent(content);
    }

    setLoading(false);
  });

  React.useEffect(() => {
    const signal = { cancelled: false };

    if (documentStatusRef.current && pendingStatusSet.has(documentStatusRef.current)) {
      fetchDocument(signal);
    }

    documentStatusRef.current = document?.status;

    return () => {
      signal.cancelled = true;
    };
  }, [document?.status]);

  React.useEffect(() => {
    const signal = { cancelled: false };

    if (documentID) {
      fetchDocument(signal);
    }

    return () => {
      signal.cancelled = true;
    };
  }, [documentID]);

  return (
    <Editor
      title="Data source"
      readOnly
      headerActions={
        <CMSEditorMoreButton>
          {({ onClose }) => (documentID ? <CMSKnowledgeBaseRowActions id={documentID} onClose={onClose} /> : null)}
        </CMSEditorMoreButton>
      }
      testID={EDITOR_TEST_ID}
    >
      {loading || !document || pendingStatusSet.has(document.status) ? (
        <Box width="100%" height="calc(100vh - 56px - 56px - 57px)">
          <TabLoader variant="dark" testID={tid(EDITOR_TEST_ID, 'loading')} />
        </Box>
      ) : (
        !!document && (
          <>
            {/* <CMSKnowledgeBaseEditorTags tags={TAGS} onTagsChange={() => {}} /> */}
            {document.data &&
            document.data.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT &&
            document.data.canEdit ? (
              <>
                <CMSKnowledgeBaseEditorContent
                  value={documentContent}
                  onBlur={onUpdateContent}
                  onValueChange={setDocumentContent}
                />
                <CMSKnowledgeBaseEditorChunks
                  chunks={document.chunks}
                  disabled={document.status !== BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS}
                />
              </>
            ) : (
              <CMSKnowledgeBaseEditorChunks
                chunks={document.chunks}
                disabled={document.status !== BaseModels.Project.KnowledgeBaseDocumentStatus.SUCCESS}
              />
            )}
          </>
        )
      )}
    </Editor>
  );
};
