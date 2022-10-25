import { Box, Link, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { HTMLSample } from '@/components/AceEditor/HTML';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import Section from './components/Section';

const getSample = (projectID: string) => `<script>
  function _vf_load() {
    window.voiceflow.chat.load({ 
      verify: { projectID: '${projectID}' },
      url: '${GENERAL_RUNTIME_ENDPOINT}'
    });
  }
</script>
<script src="https://unpkg.com/@voiceflow/react-chat/iframe/dist/bundle.mjs" onload="_vf_load()"></script>`;

export const PublishSection: React.FC = () => {
  const projectID = useSelector(ProjectV2.active.idSelector)!;

  return (
    <Section icon="publish" title="Installation" description="Add the installation code to your website">
      <Text>
        Copy this code snippet and paste it before the closing <Text color={ThemeColor.BLUE}>{`</body>`}</Text> tag on every page you want the widget
        to appear.
      </Text>
      <Box my={16}>
        <HTMLSample sample={getSample(projectID)} />
      </Box>
      <Text fontSize={13} color={ThemeColor.SECONDARY}>
        Having trouble or need to customize? <Link>See documentation</Link>
      </Text>
    </Section>
  );
};
