/* eslint-disable no-nested-ternary */
import { IS_MAC } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const hotKey = IS_MAC ? '⌘↵' : 'Ctrl↵';

const PostButton = styled.div<{ disabled?: boolean; isDone?: boolean; isPosting?: boolean }>`
  margin-left: 10px;
  color: #62778c;
  min-width: ${({ isDone }) => (IS_MAC ? (isDone ? 50 : 44) : 52)}px;
  font-size: 13px;
  font-weight: 600;
  background-color: rgba(238, 244, 246, 0.85);
  padding: 3px 8px;
  border-radius: 6px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-align: center;

  ${({ isDone }) =>
    css`
      &:before {
        content: '${isDone ? 'Done' : 'Post'}';
      }

      &:hover {
        &:before {
          content: '${hotKey}';
        }
      }
    `}
`;

export default PostButton;
