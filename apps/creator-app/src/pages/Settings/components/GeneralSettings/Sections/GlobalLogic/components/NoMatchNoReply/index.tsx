import * as Platform from '@voiceflow/platform-config';
import { Box, Button, SectionV2, System } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { LEARN_NO_MATCH } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import MessageDelayPopper from './MessageDelayPopper';

const GeneralSettingsNoMatchNoReplySection: React.FC = () => {
  const meta = useSelector(ProjectV2.active.metaSelector);
  const { project } = Platform.Config.getTypeConfig(meta);

  const noMatchModal = ModalsV2.useModal(ModalsV2.Canvas.GlobalNoMatch);
  const noReplyModal = ModalsV2.useModal(ModalsV2.Canvas.GlobalNoReply);

  return (
    <>
      <Settings.SubSection contentProps={{ topOffset: 3 }}>
        <Box.FlexApart gap={32}>
          <div>
            <Settings.SubSection.Title>Global No Match</Settings.SubSection.Title>

            <Settings.SubSection.Description>
              The fallback response that will trigger if the user fails to match any intent.&nbsp;
              <System.Link.Anchor href={LEARN_NO_MATCH}>Learn more</System.Link.Anchor>
            </Settings.SubSection.Description>
          </div>

          <Button variant={Button.Variant.SECONDARY} flat onClick={() => noMatchModal.openVoid()}>
            Edit
          </Button>
        </Box.FlexApart>
      </Settings.SubSection>

      {project.noReply && (
        <>
          <SectionV2.Divider />

          <Settings.SubSection contentProps={{ topOffset: 3 }}>
            <Box.FlexApart gap={24}>
              <div>
                <Settings.SubSection.Title>Global No Reply</Settings.SubSection.Title>

                <Settings.SubSection.Description>
                  The fallback response that will trigger if the user says nothing for <MessageDelayPopper /> seconds.
                </Settings.SubSection.Description>
              </div>

              <Button variant={Button.Variant.SECONDARY} flat onClick={() => noReplyModal.openVoid()}>
                Edit
              </Button>
            </Box.FlexApart>
          </Settings.SubSection>
        </>
      )}
    </>
  );
};

export default GeneralSettingsNoMatchNoReplySection;
