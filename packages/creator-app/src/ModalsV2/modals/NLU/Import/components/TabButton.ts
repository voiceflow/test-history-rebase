import { transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const TabButton = styled.button<{ active?: boolean }>`
  ${transition('background', 'color', 'opacity')};
  font-weight: 600;
  font-size: 15px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;

  ${({ active }) =>
    !active
      ? css`
          background-color: rgba(61, 130, 226, 0.1);
          color: #3d82e2;
          border-radius: 8px;
          border: none;
          outline: none;
        `
      : css`
          color: #949db0;
          background: none;
          padding: 8px 16px;
          border: none;
          box-shadow: none;

          span {
            padding: 0;
          }

          &:hover {
            color: #6e849a;
            background: none;
          }
        `};
`;

export default TabButton;
