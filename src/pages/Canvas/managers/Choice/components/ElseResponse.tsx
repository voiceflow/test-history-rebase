import React from 'react';

import Section from '@/components/Section';
import { Text } from '@/components/Text';
import { ChoiceElseType } from '@/constants';

import { ChoiceManagerEditors } from '../subeditors';

export type ElseResponseProps = {
  pushToPath: any;
  editorStatus: ChoiceElseType;
};

const TYPE: ChoiceManagerEditors = 'repromptResponse';

const ElseResponse: React.FC<ElseResponseProps> = ({ pushToPath, editorStatus }) => {
  const onOpenElseResponse = React.useCallback(
    () =>
      pushToPath({
        type: TYPE,
        label: 'Else',
      }),
    [pushToPath]
  );

  return (
    <Section
      header={<Text fontWeight="normal">Else</Text>}
      infix={<div>{editorStatus === ChoiceElseType.PATH ? 'Path' : 'Reprompt'}</div>}
      tooltipProps={{ helpTitle: null, helpMessage: null }}
      status="Empty"
      isLink
      onClick={onOpenElseResponse}
    />
  );
};

export default ElseResponse;
