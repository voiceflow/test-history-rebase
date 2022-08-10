import { Nullable } from '@voiceflow/common';
import { Comment } from '@voiceflow/realtime-sdk';
import { BoxFlex, Dropdown, FlexEnd, IconButton, IconButtonVariant, Menu, MenuItem, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import PostButton from './PostButton';

export interface CommentActionsProps {
  onPost: VoidFunction;
  onEdit?: VoidFunction;
  comment?: Nullable<Comment>;
  onDelete?: VoidFunction;
  onResolve?: VoidFunction;
  isPosting?: boolean;
  isEditing?: boolean;
  isDisabled?: boolean;
  currentUserID: number;
  isThreadEditing?: boolean;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  onPost,
  onEdit,
  comment,
  onDelete,
  onResolve,
  isPosting,
  isEditing,
  isDisabled,
  currentUserID,
  isThreadEditing,
}) => {
  const isCommentOwner = !!comment && comment.creatorID === currentUserID;

  return (
    <FlexEnd>
      {!isEditing ? (
        <>
          {isCommentOwner && (onEdit || onDelete) && (
            <Dropdown
              portal={null}
              menu={
                <Menu>
                  {onEdit && <MenuItem onClick={onEdit}>Edit</MenuItem>}
                  {onDelete && <MenuItem onClick={onDelete}>Delete</MenuItem>}
                </Menu>
              }
            >
              {(ref, onToggle, isOpen) => (
                <IconButton
                  ref={ref}
                  size={16}
                  icon="ellipsis"
                  active={isOpen}
                  variant={IconButtonVariant.SUBTLE}
                  onClick={swallowEvent(onToggle)}
                  disabled={isThreadEditing}
                  iconProps={{ color: '#becedc' }}
                  hoverColor={isOpen ? '#132144' : '#6e849a'}
                />
              )}
            </Dropdown>
          )}

          {!!comment && !!onResolve && (
            <TippyTooltip title="Mark Resolved" distance={1} disabled={isThreadEditing}>
              <BoxFlex ml={16}>
                <IconButton
                  size={16}
                  icon="checkmark2"
                  variant={IconButtonVariant.SUBTLE}
                  onClick={swallowEvent(onResolve)}
                  disabled={isThreadEditing}
                  iconProps={{ color: '#becedc' }}
                  hoverColor="#6e849a"
                />
              </BoxFlex>
            </TippyTooltip>
          )}
        </>
      ) : (
        <PostButton
          isDone={!!comment?.id}
          onClick={isDisabled ? undefined : swallowEvent(onPost)}
          disabled={isDisabled || isPosting}
          isPosting={isPosting}
        />
      )}
    </FlexEnd>
  );
};

export default CommentActions;
