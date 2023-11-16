import { Nullable } from '@voiceflow/common';
import { ThreadComment } from '@voiceflow/dtos';
import { Comment as LegacyComment } from '@voiceflow/realtime-sdk';
import { Box, Dropdown, FlexEnd, IconButton, IconButtonVariant, Menu, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import PostButton from './PostButton';

export interface CommentActionsProps {
  onPost: VoidFunction;
  onEdit?: VoidFunction;
  comment?: Nullable<ThreadComment | LegacyComment>;
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
  const isCommentOwner = !!comment && ('creatorID' in comment ? comment.creatorID : comment.authorID) === currentUserID;

  return (
    <FlexEnd>
      {!isEditing ? (
        <>
          {isCommentOwner && (onEdit || onDelete) && (
            <Dropdown
              portal={null}
              menu={
                <Menu>
                  {onEdit && <Menu.Item onClick={onEdit}>Edit</Menu.Item>}
                  {onDelete && <Menu.Item onClick={onDelete}>Delete</Menu.Item>}
                </Menu>
              }
            >
              {({ ref, onToggle, isOpen }) => (
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
            <TippyTooltip content="Mark Resolved" offset={[0, 1]} disabled={isThreadEditing}>
              <Box.Flex ml={16}>
                <IconButton
                  size={16}
                  icon="checkmark2"
                  variant={IconButtonVariant.SUBTLE}
                  onClick={swallowEvent(onResolve)}
                  disabled={isThreadEditing}
                  iconProps={{ color: '#becedc' }}
                  hoverColor="#6e849a"
                />
              </Box.Flex>
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
