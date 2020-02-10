import Flex from '@/components/Flex';
import { MemberIcon } from '@/components/User';
import { css, styled, units } from '@/hocs';

const CommentBlockContainer = styled(Flex)`
  position: absolute;
  left: 50%;
  width: 185px;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: ${units(0.5)}px;
  transform: translateX(-50%);
  cursor: pointer;

  ${({ isActive }) =>
    isActive
      ? css`
          border: 1px dashed #c2c6d5;
        `
      : css`
          &:hover {
            border: 1px solid #c2c6d575;
          }
        `};

  & > textarea {
    width: 100%;
    border: 0;
    padding: 0;
    font-size: 15px;
    line-height: 20px;
    background: none;
    overflow: hidden;
    box-shadow: none;
    resize: none;

    &:focus {
      outline: 0;
    }

    &:disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  ${MemberIcon} {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
`;

export default CommentBlockContainer;
