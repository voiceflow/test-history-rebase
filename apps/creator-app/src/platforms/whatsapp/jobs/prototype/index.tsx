import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import { Icon } from '@voiceflow/ui-next';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useSimulatedProgress } from '@/hooks/job';
import RunButton from '@/pages/Project/components/RunButton/button';
import { useRunPrototype } from '@/pages/Project/components/RunButton/hooks';

import { useTwilioPrototypeStageContent } from './stages';

const TwilioPrototypeRun: React.FC<React.ComponentProps<typeof RunButton>> = () => {
  const runPrototype = useRunPrototype();

  const context = React.useContext(PrototypeJobContext)!;
  const { job, active } = context;

  const Content = useTwilioPrototypeStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  const buttonProps = {
    loading: active,
  };

  return (
    <JobInterface Content={Content} context={context} progress={progress}>
      <Dropdown
        inlinePopper
        menu={() => (
          <Menu>
            <Menu.Item onClick={runPrototype}>
              <Box mr={16}>
                <Icon name="VoiceflowLogomark" />
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
        placement="bottom"
      >
        {({ ref, onToggle, isOpen, popper }) => (
          <div ref={ref} onMouseEnter={() => !isOpen && onToggle()} onMouseLeave={() => isOpen && onToggle()}>
            <RunButton {...buttonProps} active={isOpen} onClick={runPrototype} />
            {!active && popper}
          </div>
        )}
      </Dropdown>
    </JobInterface>
  );
};

export default TwilioPrototypeRun;
