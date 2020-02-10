import { flexCenterStyles } from '@/components/Flex';
import { css } from '@/hocs';

export const mergeStatusStyle = (canMerge, cannotMerge) =>
  canMerge || cannotMerge
    ? {
        background: canMerge ? '#00c0ff90' : '#dfdfdf90',
        top: '-6px',
        height: 'calc(100% + 6px)',
        width: '100%',
        border: 0,
      }
    : {};

// eslint-disable-next-line import/prefer-default-export
export const mergeOverlayStyles = css`
  ${flexCenterStyles}

  z-index: 10;
`;
