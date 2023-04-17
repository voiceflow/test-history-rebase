import { Nullable } from '@voiceflow/common';
import { Box, Button, Dropdown, Input, MenuTypes, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { ProjectAPIKey } from '@/models';

export interface ProjectAPIKeySectionProps extends React.PropsWithChildren {
  show: boolean;
  title: string;
  apiKey: Nullable<ProjectAPIKey>;
  options: Nullable<MenuTypes.OptionWithoutValue>[];
  loading?: boolean;
  onToggleShow: VoidFunction;
}

const ProjectAPIKeySection: React.FC<ProjectAPIKeySectionProps> = ({ show, title, apiKey, options, children, loading, onToggleShow }) => (
  <Settings.SubSection header={title}>
    <Box.Flex>
      <Input
        type={show ? 'text' : 'password'}
        value={apiKey?.key ?? '****************'}
        disabled={loading}
        readOnly
        rightAction={
          <SvgIcon
            icon={show ? 'eye2' : 'eyeHide2'}
            onClick={onToggleShow}
            color="rgba(98, 118, 140, 85%)"
            clickable
            style={{ userSelect: 'none' }}
          />
        }
      />

      <Box ml={16}>
        <Dropdown options={options} placement="bottom" selfDismiss={true}>
          {({ ref, onToggle, isOpen }) => (
            <Button
              onClick={onToggle}
              ref={ref}
              icon="ellipsis"
              variant={Button.Variant.SECONDARY}
              isActive={isOpen}
              disabled={loading}
              iconProps={{ size: 14 }}
            />
          )}
        </Dropdown>
      </Box>

      <Box ml={10}>{children}</Box>
    </Box.Flex>
  </Settings.SubSection>
);

export default ProjectAPIKeySection;
