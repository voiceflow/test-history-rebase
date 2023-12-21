import { BaseModels } from '@voiceflow/base-types';
import { Box, Editor, TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';
import { CMSKnowledgeBaseRowActions } from '../CMSKnowledgeBaseRowActions/CMSKnowledgeBaseRowActions.component';
import { CMSKnowledgeBaseEditorChunks } from './CMSKnowledgeBaseEditorChunks/CMSKnowledgeBaseEditorChunks.component';
import { CMSKnowledgeBaseEditorContent } from './CMSKnowledgeBaseEditorContent/CMSKnowledgeBaseEditorContent.component';

export const CMSKnowledgeBaseEditor: React.FC = () => {
  const documentID = useCMSActiveResourceID();

  const document = useSelector(Designer.KnowledgeBase.Document.selectors.oneByID, { id: documentID });

  const getDocument = useDispatch(Designer.KnowledgeBase.Document.effect.getOne);
  const deleteDocument = useDispatch(Designer.KnowledgeBase.Document.effect.deleteOne);
  const getDocumentData = useDispatch(Designer.KnowledgeBase.Document.effect.getOneBlobData);
  const createTextDocuments = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromText);

  const [loading, setLoading] = React.useState(false);
  const [documentContent, setDocumentContent] = React.useState<string | null>(null);
  const [documentOriginalContent, setDocumentOriginalContent] = React.useState<string | null>(null);

  const onUpdateContent = async () => {
    if (!document || !documentContent || documentContent === documentOriginalContent) return;

    await deleteDocument(documentID);
    await createTextDocuments([documentContent]);
  };

  React.useEffect(() => {
    let prevented = false;

    (async () => {
      setLoading(true);

      const newDocument = await getDocument(documentID);

      if (prevented) return;

      if (newDocument.data?.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT && newDocument.data.canEdit) {
        const fetchedContent = await getDocumentData(documentID);
        const content = await fetchedContent.blob.text();

        if (prevented) return;

        setDocumentContent(content);
        setDocumentOriginalContent(content);
      }

      setLoading(false);
    })();

    return () => {
      prevented = true;
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
    >
      {loading && !document ? (
        <Box width="100%" height="calc(100vh - 56px - 56px - 57px)">
          <TabLoader variant="dark" />
        </Box>
      ) : (
        !!document && (
          <>
            {/* <CMSKnowledgeBaseEditorTags tags={TAGS} onTagsChange={() => {}} /> */}
            {document.data && document.data.type === BaseModels.Project.KnowledgeBaseDocumentType.TEXT && document.data.canEdit ? (
              <CMSKnowledgeBaseEditorContent value={documentContent} onBlur={onUpdateContent} onValueChange={setDocumentContent} />
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
