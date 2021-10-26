import { Box, colors, ThemeColor } from '@voiceflow/ui';
import Markdown from 'markdown-to-jsx';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

import { MessageProps } from '../components/Message';

const SubjectText = styled.div`
  color: ${colors(ThemeColor.SECONDARY)};

  ::first-letter {
    text-transform: capitalize;
  }

  strong {
    color: ${colors(ThemeColor.RED)};
  }

  em {
    color: ${colors(ThemeColor.PRIMARY)};
    font-weight: bold;
    font-style: normal;
  }
`;

type DebugProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
};

const HYPHEN_REGEXP = /-/g;

export const Debug: React.FC<DebugProps & ConnectedDebugProps> = ({ message, getDiagram, ...props }) => {
  const debugMessage = React.useMemo(() => {
    let formattedMessage = message;

    if (message.includes('entering flow')) {
      const flowID = message.split(' ')[2].replace(/`/g, '');

      const name = getDiagram(flowID)?.name || flowID;

      formattedMessage = `entering flow \`${name}\``;
    }

    // eslint-disable-next-line no-useless-escape, prettier/prettier
    formattedMessage = formattedMessage.replace(HYPHEN_REGEXP, '\-');

    return formattedMessage;
  }, [message]);

  return (
    <Box mt={8} mb={12} fontSize={13} style={{ textAlign: 'center' }} {...props}>
      <SubjectText>
        <Markdown>{debugMessage}</Markdown>
      </SubjectText>
    </Box>
  );
};

const mapStateToProps = {
  getDiagram: DiagramV2.getDiagramByIDSelector,
};

type ConnectedDebugProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Debug);
