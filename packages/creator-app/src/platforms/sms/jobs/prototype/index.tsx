import * as Platform from '@voiceflow/platform-config';
import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useSimulatedProgress } from '@/hooks/job';
import RunButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/button';
import { useRunPrototype } from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/hooks';

import { useTwilioPrototypeStageContent } from './stages';

const TwilioPrototypeRun: React.FC<React.ComponentProps<typeof RunButton>> = ({ variant }) => {
  const runPrototype = useRunPrototype();

  const context = React.useContext(PrototypeJobContext)!;
  const { job, active } = context;

  const Content = useTwilioPrototypeStageContent(job?.stage.type);

  const progress = useSimulatedProgress(job);

  const buttonProps = {
    variant,
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
                <SvgIcon icon="voiceflowV" />
              </Box>
              Test on Voiceflow
            </Menu.Item>
            <Menu.Item onClick={() => context.start()}>
              <Box mr={16}>
                <SvgIcon icon={Platform.SMS.Chat.CONFIG.icon.name} color={Platform.SMS.Chat.CONFIG.icon.color} />
              </Box>
              Test via SMS
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
