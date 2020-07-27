import React from 'react';

import { ButtonBox, Flex } from '@/components/Box';
import Dropdown from '@/components/Dropdown';
import { FlexEnd } from '@/components/Flex';
import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Menu, { MenuItem } from '@/components/Menu';
import TippyTooltip from '@/components/TippyTooltip';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';
import { noop } from '@/utils/functional';

export type CommentActionsProps = {
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
};

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
  const commenting = React.useContext(CommentModeContext);

  const isCommentOwner = creatorID === currentUser;

  return (
    <FlexEnd>
      {commentID && isPosted && isCommentOwner && (
        <Dropdown
          menu={
            <Menu>
              {/* Disable edit button if there is already a comment in editing mode */}
              <MenuItem disabled={!!commenting.editingComment} onClick={onEdit}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => commenting.deleteComment(threadID!, commentID!)}>Delete</MenuItem>
            </Menu>
          }
        >
          {(ref, onToggle, isOpen) => (
            <IconButton
              ref={ref}
              size={16}
              icon="elipsis"
              variant={IconButtonVariant.SUBTLE}
              onClick={onToggle}
              iconProps={{ color: isOpen ? '#6e849a' : '#becedc' }}
              hoverColor="#6e849a"
            />
          )}
        </Dropdown>
      )}
      {threadID && isPosted && showResolve && (
        <TippyTooltip title="Mark Resolved" distance={1}>
          <Flex ml={16}>
            <IconButton
              size={16}
              icon="check2"
              variant={IconButtonVariant.SUBTLE}
              onClick={() => commenting.resolveThread(threadID)}
              iconProps={{ color: '#becedc' }}
              hoverColor="#6e849a"
            />
          </Flex>
        </TippyTooltip>
      )}
      {!isPosted && (
        <ButtonBox
          ml={10}
          onClick={isDisabled ? noop : onPost}
          color="#62778c"
          fontSize={13}
          fontWeight={600}
          backgroundColor="rgba(238, 244, 246, 0.85)"
          p="3px 8px"
          borderRadius="5px"
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
        >
          {commentID && isEditing ? 'Done' : 'Post'}
        </ButtonBox>
      )}
    </FlexEnd>
  );
};

export default CommentActions;
