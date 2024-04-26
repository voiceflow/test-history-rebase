import { tid } from '@voiceflow/style';
import type { BaseProps } from '@voiceflow/ui-next';
import {
  Box,
  Chunk,
  Collapsible,
  CollapsibleHeader,
  CollapsibleHeaderButton,
  Divider,
  Section,
  TextArea,
} from '@voiceflow/ui-next';
import React from 'react';

import { clipboardCopyWithToast } from '@/utils/clipboard.util';

import {
  dividerStyles,
  responseBoxStyles,
  sourcesContainerStyles,
  sourcesContentStyles,
  sourcesHeaderStyles,
} from './KnowledgeBasePreviewQuestion.css';

export interface IKBPreviewQuestionResponse extends BaseProps {
  loading: boolean;
  sources: { source: { name: string }; content: string }[] | undefined;
  response?: string;
  hasResponse?: boolean;
  onSourceClick: (sourceName: string) => void;
}

export const KBPreviewQuestionResponse: React.FC<IKBPreviewQuestionResponse> = ({
  sources,
  loading,
  response = '',
  hasResponse,
  onSourceClick,
  testID,
}) => {
  return (
    <Box direction="column" className={responseBoxStyles} testID={testID}>
      <Box direction="column" width="100%" pt={11} pb={7} height="100%">
        <Section.Header.Container title="Response" variant="active">
          <Section.Header.Button
            iconName="Copy"
            disabled={loading}
            onClick={clipboardCopyWithToast(response)}
            testID={tid(testID, 'copy')}
          />
        </Section.Header.Container>
      </Box>

      <Box width="100%" direction="column" pb={24} px={24}>
        <TextArea minRows={1} value={response} disabled={loading} testID={tid(testID, 'content')} />
      </Box>

      {(hasResponse || sources) && (
        <>
          <Divider className={dividerStyles} />

          <Box direction="column" width="100%">
            <Collapsible
              isOpen={false}
              isEmpty={!sources || sources.length === 0}
              showDivider={false}
              contentClassName={sourcesContentStyles}
              containerClassName={sourcesContainerStyles}
              header={
                <CollapsibleHeader label="Sources" caption={sources?.length.toString()} className={sourcesHeaderStyles}>
                  {({ isOpen }) => (
                    <CollapsibleHeaderButton
                      isOpen={isOpen}
                      disabled={loading}
                      testID={tid(testID, ['sources', 'toggle-collapsed'])}
                    />
                  )}
                </CollapsibleHeader>
              }
            >
              <Box direction="column" gap={16} pb={24}>
                {sources?.map(({ source, content }, index) => (
                  <Chunk
                    key={index}
                    label={source.name}
                    content={content}
                    onClick={() => onSourceClick(source.name)}
                    testID={tid(testID, ['sources', 'chunk'])}
                  />
                ))}
              </Box>
            </Collapsible>
          </Box>
        </>
      )}
    </Box>
  );
};
