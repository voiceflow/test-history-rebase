import { BlockType } from '@/constants';
import { styled } from '@/hocs/styled';
import { ClassName } from '@/styles/constants';

export const Container = styled.div`
  position: absolute;
  z-index: -1;

  .${ClassName.CANVAS_NODE} {
    &--${BlockType.MARKUP_TEXT} {
      z-index: 3;
    }

    &--${BlockType.MARKUP_IMAGE} {
      z-index: 1;
    }

    &--${BlockType.MARKUP_VIDEO} {
      z-index: 1;
    }
  }
`;
