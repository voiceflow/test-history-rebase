import { AssistantCard, Button } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBox({ width: 400, backgroundColor: '#fff', padding: 30, display: 'flex', justifyContent: 'center' });
const wideWrapContainer = withBox({ width: 1200, backgroundColor: '#fff', padding: 30, display: 'flex', justifyContent: 'center' });

const simple = createExample(
  'simple',
  wrapContainer(() => <AssistantCard title="Acme Chatbot" subtitle="Edited 4 hours ago" icon="messenger" image={<></>} action={<></>} />)
);

const wide = createExample(
  'wide',
  wideWrapContainer(() => (
    <AssistantCard
      title="Acme Chatbot"
      subtitle="Edited 4 hours ago"
      icon="messenger"
      image={<></>}
      action={<Button>Click Here</Button>}
      isHovered={true}
    />
  ))
);

export default createSection('AssistantCard', 'src/components/AssistantCard/index.tsx', [wide, simple]);
