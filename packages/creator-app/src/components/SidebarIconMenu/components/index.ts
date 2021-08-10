import { SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export { default as Container } from './Container';
export { default as Item } from './Item';

export const IconContainer = styled(SvgIcon)<{ withBadge: boolean }>`
  ${({ withBadge = false }) =>
    withBadge &&
    css`
      position: relative;

      &:after {
        position: absolute;
        top: 50%;
        right: 50%;
        display: block;
        width: 6px;
        height: 6px;
        margin-top: -9px;
        margin-right: -10px;
        border: solid 1px #fff;
        border-radius: 6px;
        background-image: linear-gradient(to bottom, rgba(224, 79, 120, 0.85), #e04f78 99%);
        content: '';
      }
    `}
`;
