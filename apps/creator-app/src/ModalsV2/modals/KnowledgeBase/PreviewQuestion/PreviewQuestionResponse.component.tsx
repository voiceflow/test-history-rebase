import { Box, Collapsible, CollapsibleHeader, CollapsibleHeaderButton, Divider, Section, TextArea, toast } from '@voiceflow/ui-next';
import React from 'react';

import { copy } from '@/utils/clipboard';

import {
  dividerStyles,
  responseBoxStyles,
  sourcesContainerStyles,
  sourcesContentStyles,
  sourcesHeaderStyles,
  sourcesTextAreaStyles,
} from './PreviewQuestionResponse.css';

export interface IPreviewQuestionResponse {
  response?: string;
  hasResponse?: boolean;
  sources:
    | {
        source: {
          name: string;
        };
        content: string;
      }[]
    | undefined;
  loading: boolean;
}

export const PreviewQuestionResponse: React.FC<IPreviewQuestionResponse> = ({ response = '', hasResponse, sources, loading }) => {
  const onCopy = () => {
    copy(response);
    toast.success('Copied', { isClosable: false });
  };

  return (
    <Box direction="column" className={responseBoxStyles}>
      <Box direction="column" width="100%" py={7} height="100%">
        <Section.Header.Container title="Response" variant="active">
          <Section.Header.Button iconName="Copy" disabled={loading} onClick={onCopy} />
        </Section.Header.Container>
      </Box>
      <Box width="100%" direction="column" pb={24} px={24}>
        <TextArea minRows={1} value={response} disabled={loading} />
      </Box>
      {hasResponse && (
        <>
          <Divider className={dividerStyles} />
          <Box direction="column" width="100%">
            <Collapsible
              isEmpty={!sources || sources.length === 0}
              isOpen={false}
              showDivider={false}
              contentClassName={sourcesContentStyles}
              containerClassName={sourcesContainerStyles}
              header={
                <CollapsibleHeader label="Sources" caption={sources?.length.toString()} className={sourcesHeaderStyles}>
                  {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} disabled={loading} />}
                </CollapsibleHeader>
              }
            >
              <Box direction="column" gap={16} pb={24}>
                {sources?.map(({ source, content }, index) => {
                  const value = source.name ? `${source.name} \n ${content}` : content;
                  return <TextArea key={index} value={value} disabled className={source.name ? sourcesTextAreaStyles : undefined} />;
                })}
              </Box>
            </Collapsible>
          </Box>
        </>
      )}
    </Box>
  );
};
