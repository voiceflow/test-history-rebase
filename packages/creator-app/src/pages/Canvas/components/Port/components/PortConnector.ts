import { Canvas } from '@voiceflow/ui';

import { css, styled } from '@/hocs';
import { PORT_HIGHLIGHTED_CLASSNAME, PORT_PROTOTYPE_END_UNLINKED_CLASSNAME } from '@/pages/Canvas/constants';

const PortConnector = styled(Canvas.Port)`
  .${PORT_HIGHLIGHTED_CLASSNAME} && {
    ${({ theme, connected }) =>
      connected
        ? css`
            &:before {
              background: linear-gradient(to bottom, ${theme.colors.darkerBlue}1f, ${theme.colors.darkerBlue}3d 100%);
              border: solid 1px ${theme.colors.darkerBlue};
            }
          `
        : css`
            background: ${theme.colors.darkerBlue};
          `}
  }

  .${PORT_PROTOTYPE_END_UNLINKED_CLASSNAME} && {
    background-color: #d94c4c;
    box-shadow: 0 0 0 1px #d94c4c;
  }
`;

export default PortConnector;
