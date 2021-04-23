import Markdown from 'markdown-to-jsx';
import React from 'react';

import Box from '@/components/Box';
import * as Diagram from '@/ducks/diagram';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

import { MessageProps } from '../components/Message';

const SubjectText = styled.div`
  color: #62778c;

  ::first-letter {
    text-transform: capitalize;
  }

  strong {
    color: #e91e63;
  }

  em {
    font-weight: bold;
    font-style: normal;
    color: #132144;
  }
`;

type DebugProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
};

export const Debug: React.FC<DebugProps & ConnectedDebugProps> = ({ message, getDiagram, ...props }) => {
  const debugMessage = React.useMemo(() => {
    if (message.includes('entering flow')) {
      const flowID = message.split(' ')[2].replace(/`/g, '');
      const name = getDiagram(flowID)?.name || flowID;
      return `entering flow \`${name}\``;
    }
    return message;
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
  getDiagram: Diagram.diagramByIDSelector,
};

type ConnectedDebugProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Debug);
