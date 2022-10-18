import { BaseModels } from '@voiceflow/base-types';
import { Box, Collapse, Divider, Link, Text, ThemeColor, Toggle } from '@voiceflow/ui';
import React from 'react';

import { HTMLSample } from '@/components/AceEditor/HTML';
import { GENERAL_RUNTIME_ENDPOINT } from '@/config';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector } from '@/hooks';

import Section from './Section';
import { SectionGroup, ToggleGroup } from './styled';

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
  const project = useSelector(ProjectV2.active.projectSelector)!;
  const updateProject = useDispatch(Project.updateProjectAPIPrivacy);

  const isPublic = project.apiPrivacy === BaseModels.Project.Privacy.PUBLIC;

  const toggleProject = React.useCallback(() => {
    updateProject(projectID, isPublic ? BaseModels.Project.Privacy.PRIVATE : BaseModels.Project.Privacy.PUBLIC);
  }, [isPublic]);

  return (
    <Section icon="publish" title="Installation" description="Add the installation code to your website">
      <SectionGroup>
        <Box.FlexApart>
          <div>
            <Box color={ThemeColor.PRIMARY} fontWeight={600}>
              Enable
            </Box>
            <Text color={ThemeColor.SECONDARY} fontSize={13}>
              Allow the assistant to be publicly interacted with through webchat
            </Text>
          </div>
          <ToggleGroup>
            <Box mr={12}>{isPublic ? 'On' : 'Off'}</Box>
            <Toggle size={Toggle.Size.EXTRA_SMALL} checked={isPublic} onChange={toggleProject} />
          </ToggleGroup>
        </Box.FlexApart>
      </SectionGroup>

      <Collapse isOpen={isPublic}>
        <Divider offset={24} />
        <Text fontSize={13}>
          Copy this code snippet and paste it before the closing <Text color={ThemeColor.BLUE}>{`</body>`}</Text> tag on every page you want the
          widget to appear.
        </Text>
        <Box my={16}>
          <HTMLSample sample={getSample(projectID)} />
        </Box>
        <Text fontSize={13} color={ThemeColor.SECONDARY}>
          Having trouble or need to customize? <Link>See documentation</Link>
        </Text>
      </Collapse>
    </Section>
  );
};
