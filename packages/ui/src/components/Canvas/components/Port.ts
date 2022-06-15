import { css, styled } from '@ui/styles';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PortTypes {
  export interface Props {
    flat?: boolean;
    connected?: boolean;
    highlighted?: boolean;
  }
}

const Port = styled.div<PortTypes.Props>`
  border: 2px solid #fff;
  box-shadow: ${({ flat }) => (flat ? 'none' : '0 0 1px 0 rgba(19, 33, 68, 0.3)')};
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
  transition: width 0.1s ease, height 0.1s ease, background 0.1s ease;

  &:before {
    transition: inset 0.1s ease, border 0.1s ease;
    position: absolute;
    content: '';
    border-radius: 50%;
  }

  ${({ theme, connected, highlighted }) =>
    connected
      ? css`
          width: 14px;
          height: 14px;
          background: linear-gradient(to bottom, rgba(98, 119, 140, 0.12), rgba(98, 119, 140, 0.24) 100%);

          &:before {
            inset: 0px;
            border: solid 1px ${highlighted ? theme.colors.darkerBlue : theme.colors.secondary};
          }
        `
      : css`
          width: 18px;
          height: 18px;
          background: ${highlighted ? theme.colors.darkerBlue : '#6e849a'};

          &:before {
            inset: 1px;
            border: solid 4px #fff;
          }
        `}
`;

export default Port;
