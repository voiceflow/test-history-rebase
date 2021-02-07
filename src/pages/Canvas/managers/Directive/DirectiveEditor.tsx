import React from 'react';
import { useSelector } from 'react-redux';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Box from '@/components/Box';
import ChatWithUsLink from '@/components/ChatLink';
import OverflowMenu from '@/components/OverflowMenu';
import * as Skill from '@/ducks/skill';
import { NodeData } from '@/models/NodeData';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { HelpTooltip } from './components';

const DirectiveEditor: React.FC<NodeEditorPropsType<NodeData.Directive>> = ({ data, onChange, expanded, onExpand }) => {
  const [value, setValue] = React.useState(data.directive);
  const platform = useSelector(Skill.activePlatformSelector);

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            content: <HelpTooltip platform={platform} />,
            blockType: data.type,
            helpTitle: 'Having trouble?',
            helpMessage: (
              <>
                <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
              </>
            ),
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
