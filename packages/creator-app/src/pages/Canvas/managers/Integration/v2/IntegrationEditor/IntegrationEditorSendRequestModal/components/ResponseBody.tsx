import { Box, FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_COLORS, ACE_EDITOR_OPTIONS_V2 } from '@/components/AceEditor';
import { useToggle } from '@/hooks';
import { CustomAPITestResponse } from '@/pages/Canvas/managers/Integration/types';

import { RAW_ACE_EDITOR_COLORS } from '../constants';
import ResponseMetadata from './ResponseMetadata';

interface ResponseBodyProps {
  response: CustomAPITestResponse;
}

const ResponseBody: React.FC<ResponseBodyProps> = ({ response }) => {
  const [showRawData, toggleRawData] = useToggle(false);

  return (
    <>
      <Box mt={16} mb={16}>
        {showRawData ? (
          <AceEditor
            placeholder="Enter Body Content"
            value={response?.body}
            name="code"
            mode="json"
            hasBorder
            setOptions={{ ...ACE_EDITOR_OPTIONS_V2, readOnly: true, showGutter: false }}
            editorColors={RAW_ACE_EDITOR_COLORS}
          />
        ) : (
          <AceEditor
            placeholder="Enter Body Content"
            value={response?.body}
            name="code"
            mode="javascript"
            hasBorder
            setOptions={{ ...ACE_EDITOR_OPTIONS_V2, readOnly: true, showGutter: true }}
            editorColors={ACE_EDITOR_COLORS}
          />
        )}
      </Box>

      <FlexApart fullWidth>
        <ResponseMetadata response={response} />
        <Link style={{ fontSize: '13px' }} onClick={toggleRawData}>
          {showRawData ? 'Show Formatted' : 'Show Raw'}
        </Link>
      </FlexApart>
    </>
  );
};

export default ResponseBody;
