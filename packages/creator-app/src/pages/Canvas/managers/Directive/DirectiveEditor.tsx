import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import OverflowMenu from '@/components/OverflowMenu';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Project/contexts';

import { HelpTooltip } from './components';

const DirectiveEditor: React.FC<NodeEditorPropsType<Realtime.NodeData.Directive>> = ({ data, onChange, expanded, onExpand }) => {
  const [value, setValue] = React.useState(data.directive);
  const platform = React.useContext(PlatformContext)!;

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            content: <HelpTooltip platform={platform} />,
            blockType: data.type,
          }}
          menu={<OverflowMenu options={[{ label: 'Expand Fullscreen', onClick: onExpand }]} placement="top-end" />}
        />
      )}
      hideFooter={expanded}
      fillHeight
    >
      <Box height="100%" width="100%" position="relative">
        <AceEditor
          fullHeight={!expanded}
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
};

export default DirectiveEditor;
