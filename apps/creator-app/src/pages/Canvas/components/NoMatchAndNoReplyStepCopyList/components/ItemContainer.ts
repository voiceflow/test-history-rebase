import { ClickableText } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const ItemContainer = styled.div`
  cursor: default;
  padding: 16px 20px;
  font-size: 15px;

  ${ClickableText} {
    ${transition('opacity')}

    opacity: 0;
    margin-right: 4px;
  }

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        ${ClickableText} {
          opacity: 1;
        }
      }
    `}

  p {
    width: 100%;
    white-space: pre-line;
    margin-bottom: 0;
  }
`;

export default ItemContainer;
