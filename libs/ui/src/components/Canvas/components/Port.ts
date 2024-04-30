import type { HSLShades } from '@/components/ColorPicker/constants';
import { css, styled } from '@/styles';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PortTypes {
  export interface Props {
    flat?: boolean;
    chip?: boolean;
    palette?: HSLShades;
    connected?: boolean;
    highlighted?: boolean;
  }
}

const connectedDefaultStyles = css<PortTypes.Props>`
  width: 14px;
  height: 14px;
  background: linear-gradient(to bottom, rgba(98, 119, 140, 0.12), rgba(98, 119, 140, 0.24) 100%);

  &:before {
    inset: 0px;
    border: solid 1px ${({ theme, highlighted }) => (highlighted ? theme.colors.darkerBlue : theme.colors.secondary)};
  }
`;

const connectedChipStyles = css<PortTypes.Props>`
  width: 18px;
  height: 18px;
  background: ${({ theme, palette, highlighted }) =>
    highlighted ? theme.colors.darkerBlue : palette?.[600] ?? '#6e849a'};

  &:before {
    inset: 1px;
    border: solid 4px #fff;
  }
`;

const Port = styled.div<PortTypes.Props>`
  box-shadow: ${({ flat, chip }) => (flat || chip ? 'none' : '0 0 1px 0 rgba(19, 33, 68, 0.3)')};
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
  border: ${({ palette, chip }) => `${chip ? 3 : 2}px solid ${palette?.[500] ?? '#fff'}`};
  transition:
    width 0.1s ease,
    height 0.1s ease,
    background 0.1s ease,
    border 0.1s ease;

  &:before {
    transition:
      inset 0.1s ease,
      border 0.1s ease;
    position: absolute;
    content: '';
    border-radius: 50%;
  }

  ${({ theme, chip, connected, palette, highlighted }) =>
    // eslint-disable-next-line no-nested-ternary
    connected
      ? chip
        ? connectedChipStyles
        : connectedDefaultStyles
      : css`
          width: ${chip ? 20 : 18}px;
          height: ${chip ? 20 : 18}px;
          background: ${highlighted ? theme.colors.darkerBlue : palette?.[600] ?? '#6e849a'};

          &:before {
            inset: 1px;
            border: solid 4px #fff;
          }
        `}
`;

export default Port;
