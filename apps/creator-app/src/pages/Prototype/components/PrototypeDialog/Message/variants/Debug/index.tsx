import { Box } from '@voiceflow/ui';
import Markdown from 'markdown-to-jsx';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

import type { BaseMessageProps } from '../../Base';
import * as S from './styles';

type DebugProps = Omit<BaseMessageProps, 'iconProps'> & {
  message: string;
};

const HYPHEN_REGEXP = /-/g;

export const Debug: React.FC<DebugProps> = ({ message, ...props }) => {
  const getDiagram = useSelector(DiagramV2.getDiagramByIDSelector);

  const debugMessage = React.useMemo(() => {
    let formattedMessage = message;

    if (message.includes('entering flow')) {
      const flowID = message.split(' ')[2].replace(/`/g, '');

      const name = getDiagram({ id: flowID })?.name || flowID;

      formattedMessage = `entering diagram \`${name}\``;
    }

    formattedMessage = formattedMessage.replace(HYPHEN_REGEXP, '-');

    return formattedMessage;
  }, [message]);

  return (
    <Box mt={8} mb={12} fontSize={13} style={{ textAlign: 'center' }} {...props}>
      <S.SubjectText>
        <Markdown>{debugMessage}</Markdown>
      </S.SubjectText>
    </Box>
  );
};

export default Debug;
