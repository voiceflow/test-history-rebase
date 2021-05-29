import { composeDecorators, withRedux } from '_storybook';
import { boolean, select } from '@storybook/addon-knobs';
import React from 'react';

import { Flex } from '@/components/Box';
import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';

import ChatDialog, { ChatDialogProps } from '.';

export default {
  title: 'PublicPrototype/ChatDialog',
  component: ChatDialog,
};

const withDecorators = composeDecorators(
  withRedux({
    prototype: {
      activePathLinkIDs: [],
      activePathBlockIDs: [],
      contextHistory: [],
      visual: {
        dataHistory: [],
      },
      webhook: null,
      flowIDHistory: [],
      contextStep: 0,
    },
    skill: {
      diagramID: '',
    },
    creator: {
      nodes: [],
      links: [],
    },
  })
);

const Component = (props: ChatDialogProps) => (
  <Flex height={800} width={654} backgroundColor="#fff" justifyContent="center" flexDirection="column" margin="0 auto">
    <ChatDialog {...props} />
  </Flex>
);

export const standard = withDecorators(() => {
  const testEnded = boolean('End Test', false);
  const customized = boolean('Custom brand color', false);
  const withChips = boolean('Show Chips', false);
  const [userResponse, setResponse] = React.useState('');
  const [isMute, setMute] = React.useState(false);
  const layout = select('Select layout', [PrototypeLayout.TEXT_DIALOG, PrototypeLayout.VOICE_DIALOG], PrototypeLayout.TEXT_DIALOG);

  return (
    <Component
      color={customized ? '#5c6bc0' : undefined}
      input={userResponse}
      isMuted={isMute}
      canRestart={!!userResponse}
      testEnded={testEnded}
      onMute={() => setMute(!isMute)}
      onReset={() => setResponse('')}
      suggestions={withChips ? ['Transfer Funds', 'Account Balance', 'Open New Account', 'Order Pizza', 'Open story'] : []}
      onInputChange={setResponse}
      locale="EN-US"
      layout={layout}
      prototypeStatus={userResponse ? PrototypeStatus.ACTIVE : PrototypeStatus.IDLE}
    />
  );
});
