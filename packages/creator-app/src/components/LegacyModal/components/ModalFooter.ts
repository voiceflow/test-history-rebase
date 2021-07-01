import * as CSS from 'csstype';

import { css, styled } from '@/hocs';

export interface ModalFooterProps {
  justifyContent?: CSS.Property.JustifyContent;
  withoutBackground?: boolean;
}

const ModalFooter = styled.div<ModalFooterProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-end'};
  padding: 24px 32px;
  border-top: 1px solid #eaeff4;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;

  ${({ withoutBackground }) =>
    !withoutBackground &&
    css`
      background: #f9f9f9;
    `};
`;

export default ModalFooter;
