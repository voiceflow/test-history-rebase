import { BlockType } from '@/constants';
import { styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled.div`
  position: absolute;
  z-index: -1;

  .${ClassName.CANVAS_NODE} {
    &--${BlockType.MARKUP_TEXT} {
      z-index: 3;
    }

    &--${BlockType.MARKUP_SHAPE} {
      z-index: 2;
    }

    &--${BlockType.MARKUP_IMAGE} {
      z-index: 1;
    }
  }
`;
