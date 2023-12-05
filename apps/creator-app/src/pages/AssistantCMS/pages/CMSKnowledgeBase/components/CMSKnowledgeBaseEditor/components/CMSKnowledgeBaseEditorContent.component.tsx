import { Collapsible, CollapsibleHeader, CollapsibleHeaderButton, LoadingSpinner, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { CMSKnowledgeBaseContext } from '@/pages/AssistantCMS/contexts/CMSKnowledgeBase.context';

export interface ICMSKnowledgeBaseEditorContent {
  documentID: string;
}

export const CMSKnowledgeBaseEditorContent: React.FC<ICMSKnowledgeBaseEditorContent> = ({ documentID }) => {
  const { actions } = React.useContext(CMSKnowledgeBaseContext);
  const [content, setContent] = React.useState<string | null>(null);
  const [originalContent, setOriginalContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await actions.getContent(documentID);
      setOriginalContent(fetchedContent);
      setContent(fetchedContent);
    };

    fetchContent();
  }, [documentID]);

  const onUpdateContent = async () => {
    if (!content) return;
    if (content === originalContent) return;
    actions.updateContent(documentID, content);
  };

  return (
    <Collapsible
      isEmpty={!content}
      isOpen={true}
      header={<CollapsibleHeader label="Content">{({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}</CollapsibleHeader>}
    >
      {content ? (
        <TextArea value={content || ''} minRows={1} onValueChange={setContent} onBlur={onUpdateContent} />
      ) : (
        <LoadingSpinner size="medium" variant="dark" />
      )}
    </Collapsible>
  );
};
