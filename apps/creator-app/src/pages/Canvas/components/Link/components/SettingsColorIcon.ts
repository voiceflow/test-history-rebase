import { css, styled, transition } from '@/hocs/styled';

interface SettingsColorIcon {
  color?: string;
  gradient?: string;
  isSimple?: boolean;
  isSelected?: boolean;
}

const SettingsColorIcon = styled.div<SettingsColorIcon>`
  ${transition('transform')};

  width: 24px;
  height: 24px;
  position: relative;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  ${({ color, gradient, isSimple }) =>
    isSimple
      ? css`
          background-color: ${color};
          box-shadow:
            0 2px 4px 0 rgba(17, 49, 96, 0.12),
            0 1px 1px 0 rgba(17, 49, 96, 0.12);
          border: solid 1px rgba(0, 0, 0, 0.08);
        `
      : css`
          background: ${gradient};

          ${!!color &&
          css`
            &:hover {
              transform: scale(1);
            }

            &:before {
              display: block;
              position: absolute;
              top: 2px;
              left: 2px;
              right: 2px;
              bottom: 2px;
              background-color: #fff;
              border-radius: 10px;

              content: '';
            }

            &:after {
              display: block;
              position: absolute;
              top: 4px;
              left: 4px;
              right: 4px;
              bottom: 4px;
              background-color: ${color};
              border-radius: 8px;

              content: '';
            }
          `}
        `}
`;

export default SettingsColorIcon;
