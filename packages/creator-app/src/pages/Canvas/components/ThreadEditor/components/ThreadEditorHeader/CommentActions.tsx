import { BoxFlex, Dropdown, FlexEnd, IconButton, IconButtonVariant, Menu, MenuItem, preventDefault, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';

import PostButton from './PostButton';

export interface CommentActionsProps {
  onPost: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
  isPosted?: boolean;
  isDisabled?: boolean;
  creatorID?: number;
  currentUser?: number;
  threadID?: string;
  commentID?: string;
  showResolve?: boolean;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  onPost,
  onEdit,
  creatorID,
  commentID,
  threadID,
  currentUser,
  isDisabled = false,
  isEditing = false,
  showResolve,
  isPosted,
}) => {
  const engine = React.useContext(EngineContext)!;

  const isCommentOwner = creatorID === currentUser;

  return (
    <FlexEnd>
      {commentID && isPosted && isCommentOwner && (
        <Dropdown
          portal={null}
          menu={
            <Menu>
              {/* Disable edit button if there is already a comment in editing mode */}
              <MenuItem onClick={onEdit}>Edit</MenuItem>
              <MenuItem onClick={() => engine.comment.deleteComment(threadID!, commentID!)}>Delete</MenuItem>
            </Menu>
          }
        >
          {(ref, onToggle, isOpen) => (
            <IconButton
              ref={ref}
              size={18}
              icon="ellipsis"
              active={isOpen}
              variant={IconButtonVariant.SUBTLE}
              onClick={preventDefault(onToggle)}
              iconProps={{ color: '#becedc' }}
              hoverColor={isOpen ? '#132144' : '#6e849a'}
            />
          )}
        </Dropdown>
      )}

      {threadID && isPosted && showResolve && (
        <TippyTooltip title="Mark Resolved" distance={1}>
          <BoxFlex ml={16}>
            <IconButton
              size={18}
              icon="checkmark"
              variant={IconButtonVariant.SUBTLE}
              onClick={() => engine.comment.resolveThread(threadID)}
              iconProps={{ color: '#becedc' }}
              hoverColor="#6e849a"
            />
          </BoxFlex>
        </TippyTooltip>
      )}

      {!isPosted && <PostButton disabled={isDisabled} onClick={isDisabled ? undefined : preventDefault(onPost)} isDone={!!commentID && isEditing} />}
    </FlexEnd>
  );
};

export default CommentActions;
