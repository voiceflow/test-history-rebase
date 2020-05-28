import Markdown from 'markdown-to-jsx';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import { connect, styled } from '@/hocs';

import { Bubble, Message } from '../components';
import { MessageProps } from '../components/Message';

const DebugMessage = styled(Message)`
  ${Bubble} {
    background: #eef4f6;
  }
`;

type DebugProps = Omit<MessageProps, 'iconProps'> & {
  message: string;
  getDiagram: (id: string) => { name: string };
};

export const Debug: React.FC<DebugProps> = ({ message, getDiagram, ...props }) => {
  const debugMessage = React.useMemo(() => {
    if (message.includes('entering flow')) {
      const flowID = message.split(' ')[2].replace(/`/g, '');
      const { name } = getDiagram(flowID);
      return `entering flow \`${name}\``;
    }
    return message;
  }, [message]);
  return (
    <DebugMessage iconProps={{ icon: 'variable', color: '#6b95e9' }} {...props}>
      <Markdown>{debugMessage}</Markdown>
    </DebugMessage>
  );
};

const mapStateToProps = {
  getDiagram: Diagram.diagramByIDSelector,
};

export default connect(mapStateToProps)(Debug);
