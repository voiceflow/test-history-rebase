import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useFeature } from '@/hooks';
import { useSimulatedProgress } from '@/hooks/job';
import RunButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/button';
import { useRunPrototype } from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/hooks';

import { useTwilioPrototypeStageContent } from './stages';

const TwilioPrototypeRun: React.FC<React.ComponentProps<typeof RunButton>> = (props) => {
  const twilioSandbox = useFeature(Realtime.FeatureFlag.TWILIO_SANDBOX).isEnabled;

  const runPrototype = useRunPrototype();

  const context = React.useContext(PrototypeJobContext)!;
  const { job, active } = context;

  const Content = useTwilioPrototypeStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  return (
    <JobInterface Content={Content} context={context} progress={progress}>
      <Dropdown
        menu={() => (
          <Menu>
            <Menu.Item onClick={runPrototype}>
              <Box mr={16}>
                <SvgIcon icon="voiceflowV" />
              </Box>
              Test on Voiceflow
            </Menu.Item>
            <Menu.Item onClick={() => context.start()}>
              <Box mr={16}>
                <SvgIcon icon="logoWhatsapp" />
              </Box>
              Test on WhatsApp
            </Menu.Item>
          </Menu>
        )}
        offset={{ offset: [0, 5] }}
        placement="bottom"
      >
        {(ref, onToggle, isOpen) => (
          <div ref={ref}>
            <RunButton
              {...props}
              loading={active}
              active={isOpen}
              onClick={(active && Utils.functional.noop) || (twilioSandbox && onToggle) || runPrototype}
            />
          </div>
        )}
      </Dropdown>
    </JobInterface>
  );
};

export default TwilioPrototypeRun;
