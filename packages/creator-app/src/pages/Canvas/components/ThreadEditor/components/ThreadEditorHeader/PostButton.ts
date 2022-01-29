/* eslint-disable no-nested-ternary */
import { IS_MAC } from '@voiceflow/ui';

import { styled } from '@/hocs';

const hotKey = IS_MAC ? '⌘↵' : 'Ctrl↵';

const PostButton = styled.div<{ disabled?: boolean; isDone?: boolean }>`
  margin-left: 10px;
  color: #62778c;
  min-width: ${({ isDone }) => (IS_MAC ? (isDone ? 50 : 44) : 52)}px;
  font-size: 13px;
  font-weight: 600;
  background-color: rgba(238, 244, 246, 0.85);
  padding: 3px 8px;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: center;

  &:before {
    content: '${({ isDone }) => (isDone ? 'Done' : 'Post')}';
  }

  &:hover {
    &:before {
      content: '${hotKey}';
    }
  }
`;

export default PostButton;
