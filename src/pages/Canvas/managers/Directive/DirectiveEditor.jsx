import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Box from '@/components/Box';
import { Content } from '@/pages/Canvas/components/Editor';

function DirectiveEditor({ data, onChange }) {
  const [value, setValue] = React.useState(data.directive);

  return (
    <Content>
      <Box height="100%" width="100%" position="relative">
        <AceEditor
          placeholder="Enter JSON code here"
          value={value}
          onChange={setValue}
          onBlur={() => onChange({ directive: value })}
          name="code"
          mode="json"
          setOptions={ACE_EDITOR_OPTIONS}
        />
      </Box>
    </Content>
  );
}

export default DirectiveEditor;
