import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Divider, Section, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { copy } from '@/utils/clipboard';

import { dividerStyles, responseBoxStyles, sourcesContainerStyles, sourcesContentStyles, sourcesHeaderStyles } from './PreviewQuestionResponse.css';

export interface IPreviewQuestionResponse {
  response?: string;
  sources:
    | {
        source: {
          name: string;
        };
        content: string;
      }[]
    | undefined;
}

export const PreviewQuestionResponse: React.FC<IPreviewQuestionResponse> = ({ response = '', sources }) => {
  return (
    <Box direction="column" height="100%" className={responseBoxStyles}>
      <Section.Header.Container title="Response">
        <Section.Header.Button iconName="Copy" onClick={() => copy(response)} />
      </Section.Header.Container>
      <Box width="100%" direction="column" pb={12} px={24}>
        <TextArea.AutoSize value={response} />
      </Box>
      <Divider className={dividerStyles} />
      <Box direction="column" width="100%" height="100%">
        <Collapsible
          isEmpty={!sources || sources.length === 0}
          isOpen={false}
          showDivider={false}
          contentClassName={sourcesContentStyles}
          containerClassName={sourcesContainerStyles}
          header={
            <CollapsibleHeader label="Sources" caption={sources?.length.toString()} className={sourcesHeaderStyles}>
              {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}
            </CollapsibleHeader>
          }
        >
          <Box direction="column" gap={16} pb={24}>
            {sources?.map(({ source, content }, index) => {
              const value = source.name ? `${source.name}\n${content}` : content;
              return <TextArea key={index} value={value} minRows={1} disabled />;
            })}
          </Box>
        </Collapsible>
      </Box>
    </Box>
  );
};
