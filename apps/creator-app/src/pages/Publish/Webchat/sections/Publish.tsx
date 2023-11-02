import { Box, System, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { PreviewHTML } from '@/components/CodePreview/HTML';
import * as Settings from '@/components/Settings';
import { GENERAL_RUNTIME_ENDPOINT, VOICEFLOW_CDN_ENDPOINT } from '@/config';
import { WEBCHAT_LEARN_MORE } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector, useTrackingEvents } from '@/hooks';

import Section from './components/Section';

const getSample = (projectID: string) => `<script type="text/javascript">
  (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: '${projectID}' },
          url: '${GENERAL_RUNTIME_ENDPOINT}',
          versionID: 'production'
        });
      }
      v.src = "${VOICEFLOW_CDN_ENDPOINT}/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
  })(document, 'script');
</script>`;

export const PublishSection: React.FC = () => {
  const projectID = useSelector(ProjectV2.active.idSelector)!;

  const [trackingEvents] = useTrackingEvents();

  return (
    <Section icon="publish" title="Installation" description="Add the installation code to your website" defaultOpen>
      <Text>
        Paste this code snippet before the closing <Text color={ThemeColor.BLUE}>{`</body>`}</Text> tag on all pages you want the widget to appear.
        Remember to <System.Link.Anchor href={WEBCHAT_LEARN_MORE}>publish a production</System.Link.Anchor> version to run your Assistant.
      </Text>

      <Box my={16}>
        <PreviewHTML code={getSample(projectID)} onCopy={() => trackingEvents.trackWebchatSnippetCopied()} />
      </Box>

      <Settings.SubSection.Description>
        Having trouble or need to customize? <System.Link.Anchor href={WEBCHAT_LEARN_MORE}>See documentation</System.Link.Anchor>
      </Settings.SubSection.Description>
    </Section>
  );
};
