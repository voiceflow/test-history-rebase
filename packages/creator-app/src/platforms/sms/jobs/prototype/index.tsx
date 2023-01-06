import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import JobInterface from '@/components/JobInterface';
import { PrototypeJobContext } from '@/contexts/PrototypeJobContext';
import { useSimulatedProgress } from '@/hooks/job';
import RunButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/button';
import { useRunPrototype } from '@/pages/Project/components/Header/components/CanvasHeader/components/Run/hooks';

import { useTwilioPrototypeStageContent } from './stages';

const TwilioPrototypeRun: React.OldFC<React.ComponentProps<typeof RunButton>> = ({ variant }) => {
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
                <SvgIcon icon="systemMessage" />
              </Box>
              Test via SMS
            </Menu.Item>
          </Menu>
        )}
        offset={{ offset: [0, 5] }}
        placement="bottom"
      >
        {(ref, onToggle, isOpen) => (
          <div ref={ref}>
            <RunButton variant={variant} loading={active} active={isOpen} onClick={onToggle} />
          </div>
        )}
      </Dropdown>
    </JobInterface>
  );
};

export default TwilioPrototypeRun;
